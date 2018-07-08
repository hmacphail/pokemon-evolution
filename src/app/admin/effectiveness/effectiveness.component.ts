import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { EffectivenessService, GenerationsService, TypesService } from "../../services";

/* Models */
import { IEffectiveness, IGeneration, IType } from "../../models";

@Component({
  selector: 'app-effectiveness',
  templateUrl: './effectiveness.component.html',
  styleUrls: ['./effectiveness.component.scss']
})
export class EffectivenessComponent implements OnInit {
  effectiveness: IEffectiveness[];
  generations: IGeneration[];
  types: IType[];

  constructor(
    private effectivenessService: EffectivenessService,
    private generationsService: GenerationsService,
    private typesService: TypesService) {
  }

  ngOnInit() {
    this.getEffectiveness();
    this.getGenerations();
    this.getTypes();
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
  //   $scope.formData = {};
  // $scope.dataStore = new DataStore();

  // $scope.dataStore.getEffectiveness(Effectiveness);
  // $scope.dataStore.getGenerations(Generations);
  // $scope.dataStore.getTypes(Types);

  createEffectivenessBulk() {
    // prep data to send
    // Effectiveness.bulkCreate(checkBulkForDuplicates(parseBulkData($scope.formData)))
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getEffectiveness(Effectiveness);
    //     }
    //   });
  }

  deleteEffectiveness(id: number) {
    this.effectivenessService.delete(id)
      .subscribe((res: any) => {
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
