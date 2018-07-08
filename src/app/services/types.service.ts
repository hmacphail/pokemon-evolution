import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IType } from "../models";

@Injectable({
	providedIn: 'root'
})
export class TypesService {

    private url = this.serverUrl + "/types";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: IType) {
    	return this.authHttp.post(this.url, data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

    getTypeIdByName(typeName) {
        // if (this.types) {
        //   for (let i = 0; i < this.types.length; i++){
        //     if (this.types[i].name == typeName){
        //       return this.types[i].id
        //     }
        //   }
        // }
        // return null;
    }
}
