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

}
