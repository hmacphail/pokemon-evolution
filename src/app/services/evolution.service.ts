import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IEvolution } from "../models";

@Injectable({
	providedIn: 'root'
})
export class EvolutionService {

    private url = this.serverUrl + "/evolutions";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    bulkCreate(data: IEvolution) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

}
