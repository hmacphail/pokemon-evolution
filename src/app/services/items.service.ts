import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IItem } from "../models";

@Injectable({
    providedIn: 'root'
})
export class ItemsService {

    private url = this.serverUrl + "/items";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
        return this.authHttp.get(this.url);
    }

    create(data: IItem) {
        return this.authHttp.post(this.url, data);
    }

    bulkCreate(data: IItem[]) {
        return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
        return this.authHttp.delete(this.url + "/" + id);
    }

    getItemNameById(itemId) {
        // if (this.items) {
        //   for (let i = 0; i < this.items.length; i++){
        //     if (this.items[i].id == [itemId]){
        //       return this.items[i].name;
        //     }
        //   }
        // }
        // return null;
        return "";
    }

    getItemIdByName(itemName) {
        // if (this.items) {
        //   for (let i = 0; i < this.items.length; i++){
        //     if (this.items[i].name == itemName){
        //       return this.items[i].id
        //     }
        //   }
        // }
        // return null;
        return -1;
    }

}
