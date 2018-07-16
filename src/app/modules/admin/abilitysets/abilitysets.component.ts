import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { AbilitysetsService, AbilitiesService, GenerationsService, PokemonService } from "../../../services";

/* Models */
import { IAbilityset, IAbility, IGeneration, IPokemon } from "../../../models";

@Component({
  selector: 'app-abilitysets',
  templateUrl: './abilitysets.component.html',
  styleUrls: ['./abilitysets.component.scss']
})
export class AbilitysetsComponent implements OnInit {
  @ViewChild("rowPokemonName") rowPokemonName: TemplateRef<any>;
  @ViewChild("rowAbilityName") rowAbilityName: TemplateRef<any>;
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];

  abilitysets: IAbilityset[];
  abilities: IAbility[];
  generations: IGeneration[];
  pokemon: IPokemon[];

  constructor(
    private abilitysetsService: AbilitysetsService,
    private abilitiesService: AbilitiesService,
    private generationsService: GenerationsService,
    private pokemonService: PokemonService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getAbilitysets();
    this.getAbilities();
    this.getGenerations();
    this.getPokemon();
    this.buildForm();
    this.tableColumnSetup();
  }

  getAbilitysets() {
    this.abilitysetsService.get().subscribe((data: any) => {
        this.abilitysets = data;
        return this.abilitysets;
      }
    );
  }

  getAbilities() {
    this.abilitiesService.get().subscribe((data: any) => {
        this.abilities = data;
        return this.abilities;
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

  getPokemon() {
    this.pokemonService.get().subscribe((data: any) => {
        this.pokemon = data;
        return this.pokemon;
      }
    );
  }

  buildForm() {
    this.adminForm = this.formBuilder.group({
      includeStarred: null,
      bulk: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "pokemonId", name: "Pokémon", flexGrow: 3, cellTemplate: this.rowPokemonName },
      { prop: "abilityId", name: "Ability", flexGrow: 3, cellTemplate: this.rowAbilityName },
      { prop: "trait", name: "Trait", flexGrow: 2 },
      { prop: "genIntroducedId", name: "Gen Introduced", flexGrow: 1 },
      { prop: "genCompletedId", name: "Gen Completed", flexGrow: 1 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createAbilitysetsBulk() {
    this.abilitysetsService.bulkCreate(this.parseBulkData(this.adminForm.value))
      .subscribe((data) => {
          this.adminForm.reset();
          this.getAbilitysets();
      });
  }

  deleteAbilityset(id: number) {
    this.abilitysetsService.delete(id)
      .subscribe((data: any) => {
        this.getAbilitysets();
      });
  }

  pokemonName(pokemonId: number) {
    return this.pokemonService.getPokemonNameById(pokemonId);
  }

  abilityName(abilityId: number) {
    return this.abilitiesService.getAbilityNameById(abilityId);
  }


  // --- helper functions ---

  parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_Ability
    let abilitysets = [];
    //let prevName = "";
    inputData.bulk.split('\n').forEach((a) => {
      let as = a.split('\t');
      // if spaces instead of tab character
      if (as.length == 1) {
        as = as[0].split('   ');
        as.forEach((a, i) => {
          as[i] = a.trim();
        });
      }

      // find duplicate rows of the same pokemon
      //if (as[2].replace('*', '').includes(prevName.replace('*', ''))) {
      //  console.log(as[2]);
      //}
      //else {
      const pokeIds = this.pokemonIdsByName(as[2], as[1]);

      // use pokemon's gen if no gen provided
      // only need to check first pokemonId as should all be same gen
      const genIntro = as[6] || this.getGenerationByPokemonId(pokeIds[0]);
      const genCompl = as[7] || null;

      if (as[3] && (!inputData.includeStarred && as[3].indexOf('*') < 0 ||
        inputData.includeStarred && as[3].indexOf('*') >= 0)) {
        // primary ability
        this.createAbilitysetObjs(pokeIds, this.abilitiesService.getAbilityIdByName(as[3]), "primary", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      if (as[4] && (!inputData.includeStarred && as[4].indexOf('*') < 0 ||
        inputData.includeStarred && as[4].indexOf('*') >= 0)) {
        // secondary ability
        this.createAbilitysetObjs(pokeIds, this.abilitiesService.getAbilityIdByName(as[4]), "secondary", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      if (as[5] && (!inputData.includeStarred && as[5].indexOf('*') < 0 ||
        inputData.includeStarred && as[5].indexOf('*') >= 0)) {
        // hidden ability
        this.createAbilitysetObjs(pokeIds, this.abilitiesService.getAbilityIdByName(as[5]), "hidden", genIntro, genCompl).forEach((as) => {
          abilitysets.push(as);
        });
      }
      //}
      //prevName = as[2];

    });

    return abilitysets;
  }

  createAbilitysetObjs(pokemonIds, abilityId, trait, genIntroducedId, genCompletedId) {
    // gen introduced is generation of pokemon
    // exception: abilities introduced in Gen III, hidden abilities introduced in Gen V
    if (trait == "hidden" && genIntroducedId < 5) {
      genIntroducedId = 5;
    }
    if (genIntroducedId < 3) {
      genIntroducedId = 3;
    }

    let as = [];
    for (let i = 0; i < pokemonIds.length; i++) {
      as.push({
        "pokemonId" : pokemonIds[i],
        "abilityId" : abilityId,
        "genIntroducedId" : genIntroducedId,
        "genCompletedId" : genCompletedId,
        "trait" : trait
      });
    }
    return as;
  }

  //======= find data entries ========
  pokemonIdsByName(name, variation) {
    name = name.replace('*', '');
    let pm = [];
    const isAlolan = (name.indexOf('Alolan') >= 0);
    if (isAlolan) {
      name = name.split(' ')[1];
    }
    for (let i = 0; i < this.pokemon.length; i++){
      const p = this.pokemon[i];

      // check that name matches
      if (p.name == name){

        // check that isAlolan if required
        if ((!isAlolan && p.form != 'alolan') || (isAlolan && p.form == 'alolan')) {

          // check that variation matches if required (unless mega)
          if (variation == name || p.form == 'mega' || p.variation == variation) {
            pm.push(p.id);
          }
        }
      }
    }

    return pm;
  }

  getGenerationByPokemonId(pokemonId) {
    for (let i = 0; i < this.pokemon.length; i++){
      if (this.pokemon[i].id == pokemonId){
        return this.pokemon[i].genIntroduced.id;
      }
    }
  }

}
