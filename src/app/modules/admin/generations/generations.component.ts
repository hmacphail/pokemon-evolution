import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

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
  generations: IGeneration[];

  adminForm: FormGroup;

  constructor(
    private generationsService: GenerationsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getGenerations();
    this.buildForm();
  }

  buildForm() {
    this.adminForm = this.formBuilder.group({
      name: null
    });
  }

  getGenerations() {
    this.generationsService.get().subscribe((data: any) => {
        this.generations = data;
        return this.generations;
      }
    );
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
