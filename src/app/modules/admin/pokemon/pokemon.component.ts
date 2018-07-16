import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { GenerationsService, PokemonService, TypesService } from "../../../services";

/* Models */
import { IGeneration, IPokemon, IType } from "../../../models";

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];

  pokemon: IPokemon[];
  generations: IGeneration[];
  types: IType[];

  constructor(
    private pokemonService: PokemonService,
    private generationsService: GenerationsService,
    private typesService: TypesService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getPokemon();
    this.getGenerations();
    this.getTypes();
    this.buildForm();
    this.tableColumnSetup();
  }

  getPokemon() {
    this.pokemonService.get().subscribe((data: any) => {
        this.pokemon = data;
        return this.pokemon;
      }
    );
  }

  getGenerations() {
    this.generationsService.get().subscribe((data: any) => {
        this.generations = data;
        return this.generations;
      }
    );
  }

  getTypes() {
    this.typesService.get().subscribe((data: any) => {
        this.types = data;
        return this.types;
      }
    );
  }

  buildForm() {
    this.adminForm = this.formBuilder.group({
      gen: null,
      bulk: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "pokedexId", name: "Pokédex ID", flexGrow: 1 },
      { prop: "name", name: "Name", flexGrow: 2 },
      { prop: "genIntroducedId", name: "Generation", flexGrow: 1 },
      { prop: "primaryTypeId", name: "Primary Type", flexGrow: 2 },
      { prop: "secondaryTypeId", name: "Secondary Type", flexGrow: 2 },
      { prop: "form", name: "Form", flexGrow: 2 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createPokemonBulk() {
    this.pokemonService.bulkCreate(this.parseBulkData(this.adminForm.value))
      .subscribe((data) => {
          this.adminForm.reset();
          this.getGenerations();
      });
  }

  deletePokemon(id: number) {
    this.pokemonService.delete(id)
      .subscribe((data) => {
        this.getPokemon();
      });
  }


  // --- helper functions ---

  parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number
    let pokemon = [];
    inputData.bulk.split('\n').forEach((p) => {
      const pkmn = p.split('\t');
      pokemon.push({
        "pokedexId" : pkmn[1].substr(1),
        "name" : pkmn[3],
        "form" : (pkmn[0] == " " && inputData.gen == "1" ? "alolan" : "original"),
        "genIntroducedId" : inputData.gen,
        "primaryTypeId" : this.typesService.getTypeIdByName(pkmn[4]),
        "secondaryTypeId" : (pkmn.length == 6 ? this.typesService.getTypeIdByName(pkmn[5]) : null)
      });
    });
    return pokemon;
  }

}
