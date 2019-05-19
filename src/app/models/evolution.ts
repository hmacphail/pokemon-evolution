import { IItem, IPokemon } from ".";

export interface IEvolution {
  id?: number;
  trigger: EvolutionTrigger;
  condition: string;
  atLevel: number;
  fromPokemonId: number;
  toPokemonId: number;
  itemId: number;
  fromPokemon?: IPokemon;
  toPokemon?: IPokemon;
  item?: IItem;
}

export enum EvolutionTrigger {
  Level = "level",
  Item = "item",
  Trade = "trade",
  Happiness = "happiness",
  Other = "other"
}