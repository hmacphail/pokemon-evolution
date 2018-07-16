import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IPokemonType } from "../models";

@Injectable({
	providedIn: 'root'
})
export class PokemonTypesService {

    private url = this.serverUrl + "/pokemon-types";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: IPokemonType) {
    	return this.authHttp.post(this.url, data);
    }

    bulkCreate(data: IPokemonType[]) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

}
