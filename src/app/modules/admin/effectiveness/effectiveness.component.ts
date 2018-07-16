import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { EffectivenessService, GenerationsService, TypesService } from "../../../services";

/* Models */
import { IEffectiveness, IGeneration, IType } from "../../../models";

@Component({
  selector: 'app-effectiveness',
  templateUrl: './effectiveness.component.html',
  styleUrls: ['./effectiveness.component.scss']
})
export class EffectivenessComponent implements OnInit {
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];

  effectiveness: IEffectiveness[];
  generations: IGeneration[];
  types: IType[];

  constructor(
    private effectivenessService: EffectivenessService,
    private generationsService: GenerationsService,
    private typesService: TypesService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getEffectiveness();
    this.getGenerations();
    this.getTypes();
    this.buildForm();
    this.tableColumnSetup();
  }

  getEffectiveness() {
    this.effectivenessService.get().subscribe((data: any) => {
        this.effectiveness = data;
        return this.effectiveness;
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
      fromGen: null,
      toGen: null,
      bulk: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "attackingTypeId", name: "Attacking", flexGrow: 2 },
      { prop: "defendingTypeId", name: "Defending", flexGrow: 2 },
      { prop: "comparison", name: "Comparison", flexGrow: 2 },
      { prop: "genIntroducedId", name: "Gen Introduced", flexGrow: 1 },
      { prop: "genCompletedId", name: "Gen Completed", flexGrow: 1 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createEffectivenessBulk() {
    // prep data to send
    this.effectivenessService.bulkCreate(this.checkBulkForDuplicates(
      this.parseBulkData(this.adminForm.value)))
      .subscribe((data) => {
          this.adminForm.reset();
          this.getEffectiveness();
      });
  }

  deleteEffectiveness(id: number) {
    this.effectivenessService.delete(id)
      .subscribe((data: any) => {
        this.getEffectiveness();
      });
  }


  // --- helper functions ---

  parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart
    const effects = inputData.bulk.split('\n');

    let effectiveness = [];
    for (let ii = 0; ii < effects.length; ii++) {
      const e = effects[ii].split('\t');
      const attType = this.typesService.getTypeIdByName(e[0]);

      for (let jj = 0; jj < effects.length; jj++) {
        const defType = this.typesService.getTypeIdByName(effects[jj].substr(0, effects[jj].indexOf('\t')));
        try {
          effectiveness.push({
            "comparison" : this.getComparisonEnum(e[jj+1]),
            "attackingTypeId" : attType,
            "defendingTypeId" : defType,
            "genIntroducedId" : parseInt(inputData.fromGen),
            "genCompletedId" : parseInt(inputData.toGen)
          });
        }
        catch(error) {
          console.log(error);
          return [];
        }
      }
    }
    return effectiveness;
  }

  checkBulkForDuplicates(dataToCheck: IEffectiveness[]) {
    // check against existing data for matches
    let bulkDataToSend = [];
    dataToCheck.forEach((newEffect) => {
      // add every object to send array
      bulkDataToSend.push(newEffect);

      for(let i = 0; i < this.effectiveness.length; i++) {
        const oldEffect = this.effectiveness[i];

        // skip if old & new generation ranges are equivalent
        if (newEffect.genIntroduced.id != oldEffect.genIntroduced.id
          && newEffect.genCompleted.id != oldEffect.genCompleted.id) {

          // if this effectiveness is equal to a previous generation (or another entry in DB)
          if (newEffect.attackingType.id == oldEffect.attackingType.id
            && newEffect.defendingType.id == oldEffect.defendingType.id
            && newEffect.comparison == oldEffect.comparison
            && newEffect.genIntroduced.id == oldEffect.genCompleted.id + 1) {

            bulkDataToSend.pop(); // remove from send array if just updating
            newEffect.genIntroduced.id = oldEffect.genIntroduced.id;
            this.effectivenessService.update(oldEffect.id, newEffect); // send update data
            break;
          }
        }
      }
    });
    return bulkDataToSend;
  }

  getComparisonEnum(multiplier: string) {
    switch(multiplier) {
      case "2×" : return "strong";
      case "1×" : return "neutral";
      case "½×" : return "weak";
      case "0×" : return "unaffected";
      default : throw new Error();
    }
  }

}
