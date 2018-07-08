import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { GamesService, GenerationsService } from "../../services";

/* Models */
import { IGame, IGeneration } from "../../models";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  games: IGame[];
  generations: IGeneration[];

  constructor(
    private gamesService: GamesService,
    private generationsService: GenerationsService) {
  }

  ngOnInit() {
    this.getGames();
    this.getGenerations();
  }

  getGames() {
    this.gamesService.get().subscribe((data: any) => {
        this.games = data;
        return this.games;
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

  createGame() {
    // this.gamesService.create(this.createGameObj($scope.formData))
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getGames(Games);
    //     }
    //   });
  }

  deleteGame(id) {
    this.gamesService.delete(id)
      .subscribe((res) => {
        this.getGames();
      });
  }

  createGameObj(formData) {
    return {
      "code": formData.code,
      "name": formData.name,
      "generationId": this.generationsService.getGenerationIdByName(formData.generation)
    };
  }
}
