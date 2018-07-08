import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

/* Models */
import { IPokemon } from "../models";

@Injectable({
	providedIn: 'root'
})
export class PokemonService {

    private url = this.serverUrl + "/pokemon";

    constructor(
        private authHttp: HttpClient,
        @Inject("serverUrl") private serverUrl: string
    ) {}

    get() {
    	return this.authHttp.get(this.url);
    }

    getById(id: number) {
    	return this.authHttp.get(this.url + "/" + id)
    }

    bulkCreate(data: IPokemon) {
    	return this.authHttp.post(this.url + "/bulk", data);
    }

    delete(id: number) {
    	return this.authHttp.delete(this.url + "/" + id);
    }

    getPokemonNameById(pokemonId) {
        // if (this.pokemon) {
        //   for (let i = 0; i < this.pokemon.length; i++){
        //     if (this.pokemon[i].id == [pokemonId]){
        //       return this.pokemon[i].name + (this.pokemon[i].form == 'alolan' ? '*' : '');
        //     }
        //   }
        // }
        // return null;
    }

}
