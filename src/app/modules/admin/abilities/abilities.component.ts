import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

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
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminForm: FormGroup;
  columns = [];

  abilities: IAbility[];
  generations: IGeneration[];

  constructor(
    private abilitiesService: AbilitiesService,
    private generationsService: GenerationsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getAbilities();
    this.getGenerations();
    this.buildForm();
    this.tableColumnSetup();
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

  buildForm() {
    this.adminForm = this.formBuilder.group({
      bulk: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "name", name: "Name", flexGrow: 2 },
      { prop: "description", name: "Description", flexGrow: 4 },
      { prop: "genIntroducedId", name: "Generation", flexGrow: 1 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createAbilitiesBulk() {
    this.abilitiesService.bulkCreate(this.parseBulkData(this.adminForm.value))
      .subscribe((data: any) => {
          this.adminForm.reset();
          this.getAbilities();
      });
  }

  deleteAbility(id: number) {
    this.abilitiesService.delete(id)
      .subscribe((data: any) => {
        this.getAbilities();
      });
  }


  parseBulkData(inputData) {
    // parse pasted data from bulbapedia table
    // http://bulbapedia.bulbagarden.net/wiki/Ability#List_of_Abilities
    let abilities = [];
    inputData.bulk.split('\n').forEach((a) => {
      const ability = a.split('\t');
      abilities.push({
        "name" : ability[1],
        "description" : ability[2],
        "genIntroducedId" : this.generationsService.getGenerationIdByName(ability[3])
      });
    });
    return abilities;
  }

}
