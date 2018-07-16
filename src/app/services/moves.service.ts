import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IMove } from "../models";

@Injectable({
	providedIn: 'root'
})
export class MovesService {

    private url = this.serverUrl + "/moves";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: IMove) {
    	return this.authHttp.post(this.url, data);
    }

    bulkCreate(data: IMove[]) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

}
