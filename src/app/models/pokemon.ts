import { IAbility, IGame, IGeneration } from ".";

export interface IPokemon {
  id: number;
  pokedexId: number;
  name: string;
  form: PokemonForm;
  variation: string;
  genIntroduced?: IGeneration;
}

export interface IPokemonStats {
  id: number;
  baseHp: number;
  baseAttack: number;
  baseDefence: number;
  baseSpAttack: number;
  baseSpDefence: number;
  baseSpeed: number;
  pokemon?: IPokemon;
}

export interface IPokemonType {
  id: number;
  genIntroduced?: IGeneration;
  genCompleted?: IGeneration;
  pokemon?: IPokemon;
  ability?: IAbility;
  game?: IGame;
}

export enum PokemonForm {
  Original = "original",
  Mega = "mega",
  Alolan = "alolan"
}
