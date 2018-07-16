import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";

/* Services */
import { ItemsService } from "../../../services";

/* Models */
import { IItem } from "../../../models";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  @ViewChild("rowDeleteEntry") rowDeleteEntry: TemplateRef<any>;
  adminFormItem: FormGroup;
  adminFormBulk: FormGroup;
  columns = [];

  items: IItem[];

  constructor(
    private itemsService: ItemsService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.getItems();
    this.buildForm();
    this.tableColumnSetup();
  }

  getItems() {
    this.itemsService.get().subscribe((data: any) => {
        this.items = data;
        return this.items;
      }
    );
  }

  buildForm() {
    this.adminFormItem = this.formBuilder.group({
      name: null,
      description: null
    });
    this.adminFormBulk = this.formBuilder.group({
      bulk: null
    });
  }

  tableColumnSetup() {
    this.columns = [
      { prop: "name", name: "Name", flexGrow: 2 },
      { prop: "description", name: "Description", flexGrow: 4 },
      { flexGrow: 1, width: 50, sortable: false, cellTemplate: this.rowDeleteEntry }
    ];
  }

  createItem() {
    this.itemsService.create(this.adminFormItem.value)
      .subscribe((data) => {
          this.adminFormItem.reset();
          this.getItems();
      });
  }

  createItemsBulk() {
    this.itemsService.bulkCreate(this.parseBulkData(this.adminFormBulk.value))
      .subscribe((data) => {
          this.adminFormBulk.reset();
          this.getItems();
      });
  }

  deleteItem(id: number) {
    this.itemsService.delete(id)
      .subscribe((data) => {
        this.getItems();
      });
  }


  // --- helper functions ---

  parseBulkData(inputData) {
    // parse pasted data from evolutionary items table
    // http://www.serebii.net/itemdex/list/evolutionary.shtml
    let items = [];
    inputData.bulk.split('\n\n').forEach(function(i){
      const item = i.split('\t');
      items.push({
        "name" : item[0],
        "description" : item[1]
      });
    });
    return items;
  }
}
