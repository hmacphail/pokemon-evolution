import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { EvolutionService, PokemonService, ItemsService } from "../../../services";

/* Models */
import { IEvolution, IPokemon, IItem } from "../../../models";

@Component({
  selector: 'app-evolution',
  templateUrl: './evolution.component.html',
  styleUrls: ['./evolution.component.scss']
})
export class EvolutionComponent implements OnInit {
  @ViewChild("rowPokemonName") rowPokemonName: TemplateRef<any>;
  @ViewChild("rowItemName") rowItemName: TemplateRef<any>;
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];

  evolutions: IEvolution[];
  pokemon: IPokemon[];
  items: IItem[];

  triggers = ['level', 'item', 'trade', 'happiness', 'other'];

  constructor(
    private evolutionService: EvolutionService,
    private pokemonService: PokemonService,
    private itemsService: ItemsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getEvolutions();
    this.getPokemon();
    this.getItems();
    this.buildForm();
    this.tableColumnSetup();
  }

  getEvolutions() {
    this.evolutionService.get().subscribe((data: any) => {
        this.evolutions = data;
        return this.evolutions;
      }
    );
  }

  getPokemon() {
    this.pokemonService.get().subscribe((data: any) => {
        this.pokemon = data;
        return this.pokemon;
      }
    );
  }

  getItems() {
    this.itemsService.get().subscribe((data: any) => {
        this.items = data;
        return this.items;
      }
    );
  }

  buildForm() {
    this.adminForm = this.formBuilder.group({
      trigger: null,
      bulk: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "fromPokemonId", name: "From Pokémon", flexGrow: 3, cellTemplate: this.rowPokemonName },
      { prop: "toPokemonId", name: "To Pokémon", flexGrow: 3, cellTemplate: this.rowPokemonName },
      { prop: "trigger", name: "Trigger", flexGrow: 2 },
      { prop: "condition", name: "Condition", flexGrow: 2 },
      { prop: "level", name: "Level", flexGrow: 1 },
      { prop: "itemId", name: "Item", flexGrow: 3, cellTemplate: this.rowItemName },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createEvolutionsBulk() {
    if (this.adminForm.value.trigger) {
      this.evolutionService.bulkCreate(this.parseBulkData(this.adminForm.value))
        .subscribe((data) => {
          this.adminForm.reset();
          this.getEvolutions();
        });
    }
  }

  deleteEvolution(id: number) {
    this.evolutionService.delete(id)
      .subscribe((data) => {
        this.getEvolutions();
      });
  }

  pokemonName(pokemonId) {
    this.pokemonService.getPokemonNameById(pokemonId);
  }

  itemName(itemId) {
    this.itemsService.getItemNameById(itemId);
  }

  //======= main parser functions ========
  parseBulkData(inputData: any): IEvolution[] {
    // parse pasted data from evolutions tables
    // https://pokemondb.net/evolution/level
    let evolutions = [];
    let prev = [];

    inputData.bulk.split('\n').forEach((e: string) => {
      const evo = e.split('\t');

      if (evo.length <= 3 ) { // dual row data entry
        if (evo.length == 1) {
          // unnecessary duplicate row -- do nothing
        }
        else if (prev.length == 0) { // first row
          prev = evo;
        }
        else { // second row
          const evs = this.parseDataRow(inputData.trigger, prev, evo);
          evs.forEach((e) => {
            evolutions.push(e);
          });
          prev = [];
        }
      }
      else { // regular data row
        const evs = this.parseDataRow(inputData.trigger, evo);
        evs.forEach((e) => {
          evolutions.push(e);
        });
      }
    });
    if (prev.length != 0) { // missed last entry
      const evs = this.parseDataRow(inputData.trigger, prev);
      evs.forEach((e) => {
        evolutions.push(e);
      });
    }

    console.log(evolutions);
    return evolutions;
  }

  parseDataRow(trigger: string, row1: string[], row2?: string[]) {
    if (row2) { // dual row data entry
      const variation = this.checkSpecialCondition(row1[2]) ? row2[0] : null;

      const frmPoke = this.checkAlolan(row1[0])
          ? this.pokemonObjsByName(this.splitPokemonNameString(row1[0].split(' ')[1]), variation, true)
          : this.pokemonObjsByName(this.splitPokemonNameString(row1[0]), variation, false);
      const toPoke = this.checkAlolan(row1[2])
          ? this.pokemonObjsByName(this.splitPokemonNameString(row1[2].split(' ')[1]), variation, true)
          : this.pokemonObjsByName(this.splitPokemonNameString(row1[2].split(' ')[0]), variation, false);

      switch (trigger) {
        case 'level' :
          return this.createEvolutionObjs(frmPoke, toPoke, row2[2], row2[1], null);
        case 'item' :
          const itemCond = this.splitItemConditionString(row2[1]);
          return this.createEvolutionObjs(frmPoke, toPoke, itemCond[1], null, this.itemsService.getItemIdByName(itemCond[0]));
        case 'trade' :
          return this.createEvolutionObjs(frmPoke, toPoke, row2[1], null, null);
        case 'happiness' :
          return this.createEvolutionObjs(frmPoke, toPoke, row2[1], null, null);
        case 'other' :
          if (row2[1] || row2[2].indexOf('Trade') >= 0) { // duplicate from other triggers
            return [];
          }
          return this.createEvolutionObjs(frmPoke, toPoke, row2[2], null, null);
      }

    } else { // regular data row
      const frmPoke = this.pokemonObjsByName(this.splitPokemonNameString(row1[0]));
      const toPoke = this.pokemonObjsByName(this.splitPokemonNameString(row1[2]));

      switch (trigger) {
        case 'level' :
          return this.createEvolutionObjs(frmPoke, toPoke, row1[4], row1[3], null);
        case 'item' :
          const itemCond = this.splitItemConditionString(row1[3]);
          return this.createEvolutionObjs(frmPoke, toPoke, itemCond[1], null, this.itemsService.getItemIdByName(itemCond[0]));
        case 'trade' :
          const item = this.itemsService.getItemIdByName(row1[3]);
          const cond = item ? null : row1[3];
          return this.createEvolutionObjs(frmPoke, toPoke, cond, null, item);
        case 'happiness' :
          return this.createEvolutionObjs(frmPoke, toPoke, row1[3], null, null);
        case 'other' :
          if (row1[3] || row1[4].indexOf('Trade') >= 0) { // duplicate from other triggers
            return [];
          }
          return this.createEvolutionObjs(frmPoke, toPoke, row1[4], null, null);
      }

    }
  }


  //======= data preparation ==========
  createEvolutionObjs(fromPokemon: IPokemon[], toPokemon: IPokemon[], condition: string, level: string, item: number) {
    let evs = [];
    for (let f = 0; f < fromPokemon.length; f++) {
      for (let t = 0; t < toPokemon.length; t++) {
        const from = fromPokemon[f];
        const to = toPokemon[t];
        // if both from and to pokemon have variations, only include when variations match
        if (from.variation != null && to.variation != null && from.variation != to.variation) {
          continue;
        }
        evs.push({
          "fromPokemonId" : from.id,
          "toPokemonId" : to.id,
          "trigger" : this.adminForm.value.trigger,
          "condition" : condition ? condition : null,
          "atLevel" : level,
          "itemId" : item
        });
      }
    }
    return evs;
  }

  splitPokemonNameString(inputStr: string) {
    const len = inputStr.length;
    const firstHalf = inputStr.substr(0, len/2);
    const secondHalf = inputStr.substr(len/2, len/2);

    if (firstHalf === secondHalf)
      return firstHalf;
    else
      return inputStr;
  }

  checkSpecialCondition(inputStr: string) {
    return inputStr.indexOf('(') >= 0;
  }

  checkAlolan(inputStr: string) {
    return inputStr.split(' ')[0] === "Alolan";
  }

  //---- data parsing for item trigger ----
  splitItemConditionString(inputStr: string) {
    const bracketInd = inputStr.indexOf('(');
    if (bracketInd >= 0) {
      const item = inputStr.substring(0, bracketInd).trim();
      const condition = inputStr.substring(bracketInd + 1, inputStr.indexOf(')'));
      return [item, condition];
    }
    return [inputStr];
  }

  //======= find entries by name string ========
  pokemonObjsByName(name: string, variation?: string, isAlolan?: boolean) {
    let pm = [];
    for (let i = 0; i < this.pokemon.length; i++){
      const p = this.pokemon[i];

      // check that name matches
      if (p.name == name) {

        // check that isAlolan if required
        if ((isAlolan && p.form == 'alolan') || (!isAlolan && p.form == 'original')) {

          // check that variation matches if required
          if (variation == null || p.variation == null || p.variation == variation) {
            pm.push(p);
          }
        }
      }
    }
    return pm;
  }

}
