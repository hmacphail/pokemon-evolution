import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IAbilityset } from "../models";

@Injectable({
	providedIn: 'root'
})
export class AbilitysetsService {

    private url = this.serverUrl + "/abilitysets";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    bulkCreate(data: IAbilityset) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }
}
