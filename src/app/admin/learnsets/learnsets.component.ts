// require('src/assets/table-to-json');

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { LearnsetsService, PokemonLearnsetsService, GenerationsService, PokemonService, MovesService, GamesService } from "../../services";

/* Models */
import { ILearnset, IPokemonLearnset, IGeneration, IPokemon, IMove, IGame } from "../../models";

@Component({
  selector: 'app-learnsets',
  templateUrl: './learnsets.component.html',
  styleUrls: ['./learnsets.component.scss']
})
export class LearnsetsComponent implements OnInit {
  learnsets: ILearnset[];
  pokemonLearnsets: IPokemonLearnset[];
  generations: IGeneration[];
  pokemon: IPokemon[];
  moves: IMove[];
  games: IGame[];

  entryCount = 0;
  pokemonArrayIndex = 0;
  gameCodesToCheck = ["RGB", "Y", "DP", "PtHGSS", "DPPt", "HGSS", "BW", "B2W2", "XY", "ORAS"];

  constructor(
    private learnsetsService: LearnsetsService,
    private pokemonLearnsetsService: PokemonLearnsetsService,
    private generationsService: GenerationsService,
    private pokemonService: PokemonService,
    private movesService: MovesService,
    private gamesService: GamesService) {
  }

  ngOnInit() {
    this.getLearnsets();
    this.getPokemonLearnsets();
    this.getGenerations();
    this.getPokemon();
    this.getMoves();
    this.getGames();
  }

  getLearnsets() {
    this.learnsetsService.get().subscribe((data: any) => {
        this.learnsets = data;
        return this.learnsets;
      }
    );
  }
  getPokemonLearnsets() {
    this.pokemonLearnsetsService.get().subscribe((data: any) => {
        this.pokemonLearnsets = data;
        return this.pokemonLearnsets;
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
  getMoves() {
    this.movesService.get().subscribe((data: any) => {
        this.moves = data;
        return this.moves;
      }
    );
  }
  getGames() {
    this.gamesService.get().subscribe((data: any) => {
        this.games = data;
        return this.games;
      }
    );
  }

  runYqlScript() {
    // // get list of all pokemon names for selected gen and down
    // const pokemon = this.allPokemonByGeneration($scope.formData.gen);
    // //const pm = pokemon[24];

    // // TEST
    // //ajaxRequestLearnsetTable(createYqlQueryUrl(pm.name, $scope.formData.gen), pm, false);

    // // TODO
    // // Promise loop
    // // each pokemon must wait for previous pokemon to complete

    // const startIndex = $scope.pokemonArrayIndex;
    // const endIndex = startIndex + 100;
    // for (let i = startIndex; i < Math.min(endIndex, pokemon.length); i++) {
    //   const pm = pokemon[i];
    //   this.ajaxRequestLearnsetTable(
    //     this.createYqlQueryUrl(pm.name, $scope.formData.gen),
    //     pm,
    //     false
    //   );
    // }
    // $scope.pokemonArrayIndex = endIndex;
  }

  createIndividualLearnset() {
    // Pokemon.getById($scope.formData.individualPokemonId).then((res) => {
    //   ajaxRequestLearnsetTable(
    //     createIndQueryUrl($scope.formData.individualUrl, $scope.formData.individualTableXPath),
    //     res.data,
    //     true
    //   );
    // });

  }

  deleteLearnset(id) {
    this.learnsetsService.delete(id)
      .subscribe((res) => {
        this.getLearnsets();
      });
  }

  createLearnsetObj(moveByLevel, moveId, generationId) {
    return {
      "level" : moveByLevel.level,
      "onEvo" : moveByLevel.onEvo,
      "byTM" : false,
      "moveId" : moveId,
    };
  }

  createPokemonLearnsetObj(learnsetId, pokemonId, generationId, gameId) {
    return {
      "learnsetId" : learnsetId,
      "pokemonId": pokemonId,
      "genIntroducedId" : generationId,
      "genCompletedId" : generationId,
      "gameId": gameId,
    };
  }

  //====== main parser functions =======
  parseLearnsetJson(results) {

    let movesByLevel = [];
    results.forEach((rowObj) => {
      const move = rowObj["Move"];

      // check for game-specific moves
      if (rowObj["Level"]) {
        this.createMoveDataFromJson(movesByLevel, move, rowObj["Level"], null);

      } else {
        // check all game codes
        this.gameCodesToCheck.forEach((code) => {
          let singleGameCode = code;

          if (rowObj[code]) {
            // extra move entry for doubled up game codes (only occurs when Pt game is included)
            if (code.includes("Pt")) {
              this.createMoveDataFromJson(movesByLevel, move, rowObj[code], "Pt");
              singleGameCode = code.replace("Pt", "");
            }

            this.createMoveDataFromJson(movesByLevel, move, rowObj[code], singleGameCode);
          }

        });

      }
    });
    //console.log(movesByLevel);
    return movesByLevel;
  }

  createMoveDataFromJson(movesArray, move, levelColumn, gameCode) {
    const level = levelColumn.split("\n")[0];
    const onEvo = (level == "Evo"); // check if "on evolution" move
    let gameId = null;

    // find game id based on given code string
    if (gameCode != null) {
      for (let i = 0; i < this.games.length; i++) {
        const gm = this.games[i];
        if (gameCode == gm.code) {
          gameId = gm.id;
          break;
        }
      }
    }

    // level is a number or onEvo (not N/A)
    if (!isNaN(parseInt(level)) || onEvo) {
      movesArray.push({
        "move" : move,
        "level" : onEvo ? null : parseInt(level),
        "onEvo" : onEvo,
        "gameId" : gameId,
      });
    }
    else if (level != "N/A") {
      console.error("couldn't find move from row", levelColumn);
    }
  }

  /**
   * checks existing pokemonLearnsets for duplicates
   * updates duplicate with new genCompletedId
   * @return {number}
   *   returns -1 if no pokemonLearnset found
   *   or pokemonLearnsetId of updated pokemonLearnset
   */
  updateIfDuplicate(newPokemonLearnset) {
    // gameId makes pokemonLearnset unique
    // if (newPokemonLearnset.gameId != null) {
    //   return -1;
    // }

    // loop through all pokemonLearnsets looking for duplicates on learnset/pokemon relationship
    for (let i = 0; i < this.pokemonLearnsets.length; i++) {
      const pl = this.pokemonLearnsets[i];

      // skip if old & new generation ranges are equivalent
      // or gameId is not null
      if (newPokemonLearnset.genIntroducedId != pl.genIntroduced.id &&
        newPokemonLearnset.genCompletedId != pl.genCompleted.id &&
        pl.game.id == null) {

        // if newPokemonLearnset is equivalent to another entry in DB
        if (newPokemonLearnset.learnsetId == pl.learnset.id
          && newPokemonLearnset.pokemonId == pl.pokemon.id
          && newPokemonLearnset.genIntroducedId == pl.genCompleted.id + 1) {

          newPokemonLearnset.genIntroducedId = pl.genIntroduced.id;
          this.pokemonLearnsetsService.update(pl.id, newPokemonLearnset); // send update data

          return pl.id;
        }
      }
    }

    return -1;
  }

  lookForExistingLearnset(newLearnset) {
    // CHECK BOTH DB AND LOCAL BEING-CREATED ARRAY OF LEARNSETS

    // loop through all learnsets looking for duplicates on level/move/etc. association
    for (let i = 0; i < this.learnsets.length; i++) {
      const ls = this.learnsets[i];

      // if newLearnset is equivalent to another entry in DB
      if (newLearnset.level == ls.level
        && newLearnset.onEvo == ls.onEvo
        && newLearnset.byTM == ls.byTM
        && newLearnset.moveId == ls.move.id) {

        return ls.id;
      }
    }

    return -1;
  }

  //====== data preparation =======
  prepAndSendLearnsets(res, pokemon, isIndividual) {

    if (!isIndividual && (pokemon.form != 'original' || pokemon.variation != null)) {
      console.log(pokemon);
      return;
    }

    this.entryCount++;

    // //try {
    // const results = $(res.query.results.result)
    //   .tableToJSON(
    //     { ignoreHiddenRows: false }
    //   );
    // // } catch(e) {
    // //   console.log(pokemon);
    // //   console.log(res);
    // // }

    // const movesByLevel = this.parseLearnsetJson(results); // parse JSON
    // const generationId = 1; // this.generationsService.getGenerationIdByName(this.gen);

    // let learnsetsToCreate = [];

    // movesByLevel.forEach((move) => { // create objects to send
    //   const newMoves = this.moveIdsByName(move.move, generationId, move.gameId);

    //   newMoves.forEach((newMoveId) => {
    //     const newLearnset = this.createLearnsetObj(move, newMoveId, generationId);
    //     const learnsetId = this.lookForExistingLearnset(newLearnset);

    //     if (learnsetId == -1) {
    //       learnsetsToCreate.push(newLearnset);
    //     }
    //   });

    // });

    // const learnsets = this.checkForLearnsetDuplicates(learnsetsToCreate);
    // if (learnsets.length > 0) {
    //   this.learnsetsService.bulkCreate(learnsets).subscribe((res) => {

    //     this.learnsetsService.get().subscribe((res: any) => {
    //       this.learnsets = res.data;
    //       this.createPokemonLearnsets(movesByLevel, pokemon, generationId);
    //     });

    //   });

    // } else {
    //   this.createPokemonLearnsets(movesByLevel, pokemon, generationId);
    // }
  }

  createPokemonLearnsets(movesByLevel, pokemon, generationId) {
    //console.log(movesByLevel);
    movesByLevel.forEach((move) => { // create objects to send
      const newMoves = this.moveIdsByName(move.move, generationId, move.gameId);

      newMoves.forEach((newMoveId) => {
        const newLearnset = this.createLearnsetObj(move, newMoveId, generationId);
        const learnsetId = this.lookForExistingLearnset(newLearnset);

        if (learnsetId != -1) {
          const newPokemonLearnset = this.createPokemonLearnsetObj(learnsetId, pokemon.id, generationId, move.gameId);
          const pokemonLearnsetId = this.updateIfDuplicate(newPokemonLearnset);
          if (pokemonLearnsetId == -1) {
            // create new pokemonLearnset
            // this.pokemonLearnsetsService.create(newPokemonLearnset);
          }

        } else {
          console.error("learnset id not found", move);
        }

      });

    });
  }

  checkForLearnsetDuplicates(ls) {
    for (let i = 0; i < ls.length; i++) {
      for (let j = 0; j < ls.length; j++) {
        if (i != j
          && ls[i].level == ls[j].level
          && ls[i].onEvo == ls[j].onEvo
          && ls[i].byTM == ls[j].byTM
          && ls[i].moveId == ls[j].moveId) {

          ls.splice(j, 1);
          break;
        }
      }
    }
    return ls;
  }

  /**
   * Produces an array containing pokemon that were introduced on or before the given level
   * @param  string genString    Name of Generation
   * @return Pokemon[]           Array of Pokemon introduced on or before Generation given by genString
   */
  allPokemonByGeneration(genString) {
    let pokemon = [];
    const gen = 1; // this.generationsService.getGenerationIdByName(genString);
    this.pokemon.forEach((p) => {
      if (p.genIntroduced.id <= gen) {
        pokemon.push(p);
      }
    });
    return pokemon;
  }

  //====== query building for learnset table retrieval ==========
  createYqlQueryUrl(pokemonName, genString) {
    // for generations excluding most recent
    const source = `https://query.yahooapis.com/v1/public/yql`;
    const query = `select * from htmlstring where url="http://bulbapedia.bulbagarden.net/wiki/${pokemonName.replace(' ', '_')}_(Pokémon)/Generation_${genString}_learnset" and xpath='//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table'`;
    const env = `store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

    return `${source}?q=${encodeURI(query)}&format=json&env=${env}&callback=`;
  }

  createIndQueryUrl(individualUrl, xpath) {
    if (xpath == null) {
      xpath = `//*[@id="mw-content-text"]/table[1]/tbody/tr[2]/td/table`;
    }

    const source = `https://query.yahooapis.com/v1/public/yql`;
    const query = `select * from htmlstring where url="${individualUrl}" and xpath='${xpath}'`;
    const env = `store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;

    return `${source}?q=${encodeURI(query)}&format=json&env=${env}&callback=`;
  }

  //====== remote data retrieval ========
  ajaxRequestLearnsetTable(requestUrl, pokemon, isIndividual) {
    // $.ajax({
    //     url: requestUrl,
    //     type: 'GET',
    //     dataType: 'json'
    //   })
    //   .done((res) => {
    //     this.prepAndSendLearnsets(res, pokemon, isIndividual);
    //   });
  }

  //======= find entries by name string ========

  /**
   * Find move within moves table by name
   * Check move names without differences in spacing/punctuation/capitalization
   * @param  string name  Name to find in existing moves table
   * @return array        IDs of move
   */
  moveIdsByName(name, genId, gameId) {
    let moveIds = [];
    name = name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();

    for (let i = 0; i < this.moves.length; i++){
      const move = this.moves[i];
      const n = move.name.replace(/[^a-zA-Z0-9]*/g, '').toLowerCase();
      // check generation range
      if (genId >= move.genIntroduced.id && (genId <= move.genCompleted.id || move.genCompleted.id == null)) {
        // check gameId
        if (move.game.id == gameId || move.game.id == null) {
          if (this.isMoveNameEquivalent(n, name)) {
            return [this.moves[i].id];
          }
        }
        else {
          if (this.isMoveNameEquivalent(n, name)) {
            moveIds.push(this.moves[i].id);
          }
        }
      }
    }

    if (moveIds.length > 0) {
      return moveIds;
    }

    console.error("no move id found", name);
    return null;
  }

  isMoveNameEquivalent(originalName, newName) {
    if (originalName == newName){
      return true;
    }
    // special conditions
    else if (originalName == 'highjumpkick' && newName == 'hijumpkick') {
      return true;
    }
    else if (originalName == 'feintattack' && newName == 'faintattack') {
      return true;
    }
    else if (originalName == 'smellingsalts' && newName == 'smellingsalt') {
      return true;
    }
    return false;
  }


}
