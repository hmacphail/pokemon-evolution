import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { AbilitiesService, GenerationsService } from "../../../services";

/* Models */
import { IAbility, IGeneration } from "../../../models";

@Component({
  selector: 'app-abilities',
  templateUrl: './abilities.component.html',
  styleUrls: ['./abilities.component.scss']
})
export class AbilitiesComponent implements OnInit {
  abilities: IAbility[];
  generations: IGeneration[];

  constructor(
    private abilitiesService: AbilitiesService,
    private generationsService: GenerationsService) {
  }

  ngOnInit() {
    this.getAbilities();
    this.getGenerations();
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

  createAbilitiesBulk() {
    // this.abilitiesService.bulkCreate(this.parseBulkData(this.formData))
    //   .subscribe((res: any) => {
    //     if (res.status == 200) {
    //       //this.formData = {};
    //       this.getAbilities();
    //     }
    //   });
  }

  deleteAbility(id) {
    this.abilitiesService.delete(id)
      .subscribe((res: any) => {
        this.getAbilities();
      });
  }

}
