import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { GamesService, GenerationsService } from "../../../services";

/* Models */
import { IGame, IGeneration } from "../../../models";

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];
  games: IGame[];
  generations: IGeneration[];

  constructor(
    private gamesService: GamesService,
    private generationsService: GenerationsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getGames();
    this.getGenerations();
    this.buildForm();
    this.tableColumnSetup();
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

 buildForm() {
    this.adminForm = this.formBuilder.group({
      generation: null,
      code: null,
      name: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "code", name: "Code", flexGrow: 2 },
      { prop: "name", name: "Name", flexGrow: 4 },
      { prop: "generationId", name: "Gen", flexGrow: 1 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createGame() {
    this.gamesService.create(this.createGameObj(this.adminForm.value))
      .subscribe((data) => {
        this.adminForm.reset();
        this.getGames();
      });
  }

  deleteGame(id: number) {
    this.gamesService.delete(id)
      .subscribe((data) => {
        this.getGames();
      });
  }

  createGameObj(formData: any): IGame {
    return {
      code: formData.code,
      name: formData.name,
      generationId: formData.generation
    };
  }
}
