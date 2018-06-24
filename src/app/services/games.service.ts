import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IGame } from "../models";

@Injectable({
	providedIn: 'root'
})
export class GamesService {

    private url = this.serverUrl + "/games";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: IGame) {
    	return this.authHttp.post(this.url, data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

}
