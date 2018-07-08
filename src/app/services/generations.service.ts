import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IGeneration } from "../models";

@Injectable({
	providedIn: 'root'
})
export class GenerationsService {

    private url = this.serverUrl + "/generations";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    create(data: IGeneration) {
    	return this.authHttp.post(this.url, data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

    getGenerationIdByName(generationName) {
        // if (this.generations) {
        //   for (let i = 0; i < this.generations.length; i++){
        //     if (this.generations[i].name == generationName){
        //       return this.generations[i].id;
        //     }
        //   }
        // }
        // return null;
    }

}
