import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IPokemonLearnset } from "../models";

@Injectable({
	providedIn: 'root'
})
export class PokemonLearnsetsService {

    private url = this.serverUrl + "/pokemon-learnsets";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: IPokemonLearnset) {
    	return this.authHttp.post(this.url, data);
    }

    bulkCreate(data: IPokemonLearnset[]) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    update(id: number, data: IPokemonLearnset) {
    	return this.authHttp.put(this.url + "/" + id, data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

}
