import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { GenerationsService, PokemonService, TypesService } from "../../services";

/* Models */
import { IGeneration, IPokemon, IType } from "../../models";

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss']
})
export class PokemonComponent implements OnInit {
  pokemon: IPokemon[];
  generations: IGeneration[];
  types: IType[];

  constructor(
    private pokemonService: PokemonService,
    private generationsService: GenerationsService,
    private typesService: TypesService) {
  }

  ngOnInit() {
    this.getPokemon();
    this.getGenerations();
    this.getTypes();
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


  // $scope.formData = {};
  // $scope.dataStore = new DataStore();

  // $scope.dataStore.getPokemon(Pokemon);
  // $scope.dataStore.getGenerations(Generations);
  // $scope.dataStore.getTypes(Types);

  createPokemonBulk() {
    // this.pokemonService.bulkCreate(parseBulkData($scope.formData))
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getPokemon(Pokemon);
    //     }
    //   });
  }

  deletePokemon(id) {
    this.pokemonService.delete(id)
      .subscribe((res) => {
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
