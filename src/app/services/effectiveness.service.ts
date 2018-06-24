import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IEffectiveness } from "../models";

@Injectable({
	providedIn: 'root'
})
export class EffectivenessService {

    private url = this.serverUrl + "/effectiveness";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: IEffectiveness) {
    	return this.authHttp.post(this.url, data);
    }

    bulkCreate(data: IEffectiveness) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    update(id: number, data: IEffectiveness) {
    	return this.authHttp.put(this.url + "/" + id, data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

}
