import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

/* Services */
import { TypesService } from "../../services";

/* Models */
import { IType } from "../../models";

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {
  types: IType[];

  constructor(
    private typesService: TypesService) {
  }

  ngOnInit() {
    this.getTypes();
  }

  getTypes() {
    this.typesService.get().subscribe((data: any) => {
        this.types = data;
        return this.types;
      }
    );
  }

  createType() {
    // Types.create($scope.formData)
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getTypes(Types);
    //     }
    //   });
  }

  deleteType(id) {
    this.typesService.delete(id)
      .subscribe((res) => {
        this.getTypes();
      });
  }

}
