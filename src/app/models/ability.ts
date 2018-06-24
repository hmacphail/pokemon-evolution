import { IGame, IGeneration, IPokemon } from ".";

export interface IAbility {
  id: number;
  name: string;
  description: string;
  genIntroduced?: IGeneration;
}

export interface IAbilityset {
  id: number;
  trait: AbilitysetTrait;
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
