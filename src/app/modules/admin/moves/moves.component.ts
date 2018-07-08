import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { GenerationsService, MovesService, TypesService } from "../../../services";

/* Models */
import { IGeneration, IMove, IType } from "../../../models";

@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.scss']
})
export class MovesComponent implements OnInit {
  moves: IMove[];
  generations: IGeneration[];
  types: IType[];

  constructor(
    private movesService: MovesService,
    private generationsService: GenerationsService,
    private typesService: TypesService) {
  }

  ngOnInit() {
    this.getMoves();
    this.getGenerations();
    this.getTypes();
  }

  getMoves() {
    this.movesService.get().subscribe((data: any) => {
        this.moves = data;
        return this.moves;
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

  createMove() {
    // Moves.create(createMoveObj($scope.formData.text))
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getMoves(Moves);
    //     }
    //   });
  }

  createMovesBulk() {
    // this.movesService.bulkCreate(parseBulkData($scope.formData))
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getMoves(Moves);
    //     }
    //   });
  }

  deleteMove = function(id) {
    this.movesService.delete(id)
      .subscribe((res) => {
        this.getMoves();
      });
  }


  // --- helper functions ---

  parseBulkData(inputData) {
    // parse pasted data from bulbapedia
    // http://bulbapedia.bulbagarden.net/wiki/List_of_moves
    let moves = [];
    inputData.bulk.split('\n').forEach((m) => {

      // check if including moves with generation-based conditions
      if (inputData.includeStarred || m.indexOf('*') < 0) {
        moves.push(this.createMoveObj(m));
      }

    });

    return moves;
  }

  createMoveObj(data) {
    let move = data.replace(/\*/g, '').split('\t');
    // if spaces instead of tab character
    if (move.length == 1) {
      move = move[0].split('   ');
      move.forEach((m, i) => {
        move[i] = m.trim();
      });
    }
    const gens = move[8].split('-');

    return {
      "name" : move[1],
      "typeId" : this.typesService.getTypeIdByName(move[2]),
      "category" : move[3].toLowerCase(),
      "pp" : move[5],
      "power" : this.isNumber(move[6]) ? move[6] : null,
      "accuracy" : this.isNumber(move[7]) ? move[7].substr(0, move[7].indexOf('%')) : null,
      "genIntroducedId" : this.generationsService.getGenerationIdByName(gens[0]),
      "genCompletedId" : gens.length > 1 ? this.generationsService.getGenerationIdByName(gens[1]) : this.mostRecentGen(),
      "isTM" : "false",
      "extraInfoColumn" : move.length > 9 ? move[9] : null,
      "extraInfo" : move.length > 9 ? move[10] : null
    };
  }

  mostRecentGen() {
    let gen = this.generations[this.generations.length-1].id;
    for (let i = 0; i < this.generations.length; i++){
      if (gen < this.generations[i].id)
        gen = this.generations[i].id;
    }
    return gen;
  }

  isNumber(data) {
    return !isNaN(parseInt(data));
  }
}
