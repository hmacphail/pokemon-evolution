import { IGame, IGeneration, IPokemon } from ".";

export interface IAbility {
  id?: number;
  name: string;
  description: string;
  genIntroducedId: number;
  genIntroduced?: IGeneration;
}

export interface IAbilityset {
  id?: number;
  trait: AbilitysetTrait;
  genIntroducedId: number;
  genCompletedId: number;
  pokemonId: number;
  abilityId: number;
  gameId: number;
  genIntroduced?: IGeneration;
  genCompleted?: IGeneration;
  pokemon?: IPokemon;
  ability?: IAbility;
  game?: IGame;
}

export enum AbilitysetTrait {
  Primary = "primary",
  Secondary = "secondary",
  Hidden = "hidden"
}
