import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { GenerationsService } from "../../services";

/* Models */
import { IGeneration } from "../../models";

@Component({
  selector: 'app-generations',
  templateUrl: './generations.component.html',
  styleUrls: ['./generations.component.scss']
})
export class GenerationsComponent implements OnInit {
  generations: IGeneration[];

  constructor(
    private generationsService: GenerationsService) {
  }

  ngOnInit() {
    this.getGenerations();
  }
  getGenerations() {
    this.generationsService.get().subscribe((data: any) => {
        this.generations = data;
        return this.generations;
      }
    );
  }

  createGen() {
    // this.generationsService.create($scope.formData)
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getGenerations(Generations);
    //     }
    //   });
  }

  deleteGen (id) {
    this.generationsService.delete(id)
      .subscribe((res) => {
        this.getGenerations();
      });
  }

}
