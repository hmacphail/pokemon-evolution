import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

/* External Libraries */
import { NgbModal, NgbModalRef, NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { DatatableComponent } from "@swimlane/ngx-datatable";

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
  items: IItem[];

  constructor(
    private itemsService: ItemsService) {
  }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.itemsService.get().subscribe((data: any) => {
        this.items = data;
        return this.items;
      }
    );
  }

  createItem() {
    // Items.create($scope.formData)
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getItems(Items);
    //     }
    //   });
  }

  createItemsBulk() {
    // Items.bulkCreate(parseBulkData($scope.formData))
    //   .then((res) => {
    //     if (res.status == 200) {
    //       $scope.formData = {};
    //       $scope.dataStore.getItems(Items);
    //     }
    //   });
  }

  deleteItem(id) {
    this.itemsService.delete(id)
      .subscribe((res) => {
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
