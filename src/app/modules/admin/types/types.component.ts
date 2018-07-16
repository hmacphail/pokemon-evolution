import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { TypesService } from "../../../services";

/* Models */
import { IType } from "../../../models";

@Component({
  selector: 'app-types',
  templateUrl: './types.component.html',
  styleUrls: ['./types.component.scss']
})
export class TypesComponent implements OnInit {
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];

  types: IType[];

  constructor(
    private typesService: TypesService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getTypes();
    this.buildForm();
    this.tableColumnSetup();
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
      name: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "name", name: "Name", flexGrow: 4 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createType() {
    this.typesService.create(this.adminForm.value)
      .subscribe((data) => {
          this.adminForm.reset();
          this.getTypes();
      });
  }

  deleteType(id: number) {
    this.typesService.delete(id)
      .subscribe((data) => {
        this.getTypes();
      });
  }

}
