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

    bulkCreate(data: IAbility[]) {
        return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
        return this.authHttp.delete(this.url + "/" + id);
    }

    getAbilityNameById(abilityId: number) {
        // if (this.abilities) {
        //   for (let i = 0; i < this.abilities.length; i++){
        //     if (this.abilities[i].id == [abilityId]){
        //       return this.abilities[i].name;
        //     }
        //   }
        // }
        // return null;
    }

    getAbilityIdByName(abilityName) {
        // if (this.abilities) {
        //   abilityName = abilityName.replace('*', '');
        //   for (let i = 0; i < this.abilities.length; i++){
        //     if (this.abilities[i].name == abilityName){
        //       return this.abilities[i].id;
        //     }
        //   }
        // }
        // return null;
    }
}
