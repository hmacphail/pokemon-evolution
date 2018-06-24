import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { ILearnset } from "../models";

@Injectable({
	providedIn: 'root'
})
export class LearnsetsService {

    private url = this.serverUrl + "/learnsets";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: ILearnset) {
    	return this.authHttp.post(this.url, data);
    }

    bulkCreate(data: ILearnset) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    update(id: number, data: ILearnset) {
    	return this.authHttp.put(this.url + "/" + id, data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

}
