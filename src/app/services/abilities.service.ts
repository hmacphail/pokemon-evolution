import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IAbility } from "../models";

@Injectable({
    providedIn: 'root'
})
export class AbilitiesService {

    private url = this.serverUrl + "/abilities";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
        return this.authHttp.get(this.url);
    }

    bulkCreate(data: IAbility) {
        return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
        return this.authHttp.delete(this.url + "/" + id);
    }
}
