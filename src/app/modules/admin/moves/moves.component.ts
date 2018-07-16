import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

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
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminFormItem: FormGroup;
  adminFormBulk: FormGroup;
  columns = [];

  moves: IMove[];
  generations: IGeneration[];
  types: IType[];

  constructor(
    private movesService: MovesService,
    private generationsService: GenerationsService,
    private typesService: TypesService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getMoves();
    this.getGenerations();
    this.getTypes();
    this.buildForm();
    this.tableColumnSetup();
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

  buildForm() {
    this.adminFormItem = this.formBuilder.group({
      text: null
    });
    this.adminFormBulk = this.formBuilder.group({
      includeStarred: null,
      bulk: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "name", name: "Name", flexGrow: 2 },
      { prop: "type", name: "Type", flexGrow: 2 },
      { prop: "category", name: "Category", flexGrow: 2 },
      { prop: "pp", name: "PP", flexGrow: 1 },
      { prop: "power", name: "Power", flexGrow: 1 },
      { prop: "accuracy", name: "Accuracy", flexGrow: 1 },
      { prop: "genIntroducedId", name: "Gen Introduced", flexGrow: 1 },
      { prop: "genCompletedId", name: "Gen Completed", flexGrow: 1 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createMove() {
    this.movesService.create(this.createMoveObj(this.adminFormItem.value.text))
      .subscribe((data) => {
          this.adminFormItem.reset();
          this.getMoves();
      });
  }

  createMovesBulk() {
    this.movesService.bulkCreate(this.parseBulkData(this.adminFormBulk.value))
      .subscribe((data) => {
          this.adminFormBulk.reset();
          this.getMoves();
      });
  }

  deleteMove(id: number) {
    this.movesService.delete(id)
      .subscribe((data) => {
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
    return null;
    // return {
    //   "name" : move[1],
    //   "typeId" : this.typesService.getTypeIdByName(move[2]),
    //   "category" : move[3].toLowerCase(),
    //   "pp" : move[5],
    //   "power" : this.isNumber(move[6]) ? move[6] : null,
    //   "accuracy" : this.isNumber(move[7]) ? move[7].substr(0, move[7].indexOf('%')) : null,
    //   "genIntroducedId" : this.generationsService.getGenerationIdByName(gens[0]),
    //   "genCompletedId" : gens.length > 1 ? this.generationsService.getGenerationIdByName(gens[1]) : this.mostRecentGen(),
    //   "isTM" : false,
    //   "extraInfoColumn" : move.length > 9 ? move[9] : null,
    //   "extraInfo" : move.length > 9 ? move[10] : null
    // };
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
