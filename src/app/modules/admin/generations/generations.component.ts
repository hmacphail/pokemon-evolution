import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { GenerationsService } from "../../../services";

/* Models */
import { IGeneration } from "../../../models";

@Component({
  selector: 'app-generations',
  templateUrl: './generations.component.html',
  styleUrls: ['./generations.component.scss']
})
export class GenerationsComponent implements OnInit {
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];

  generations: IGeneration[];

  constructor(
    private generationsService: GenerationsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getGenerations();
    this.buildForm();
    this.tableColumnSetup();
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
      name: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "name", name: "Name", flexGrow: 4 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createGen() {
    this.generationsService.create(this.adminForm.value)
      .subscribe((data) => {
          this.adminForm.reset();
          this.getGenerations();
      });
  }

  deleteGen (id: number) {
    this.generationsService.delete(id)
      .subscribe((data) => {
        this.getGenerations();
      });
  }

}
