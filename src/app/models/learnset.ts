import { IGame, IGeneration, IPokemon, IMove } from ".";

export interface ILearnset {
  id: number;
  level: number;
  onEvo: boolean;
  byTM: boolean;
  move?: IMove;
}

export interface IPokemonLearnset {
  id: number;
  genIntroduced?: IGeneration;
  genCompleted?: IGeneration;
  pokemon?: IPokemon;
  learnset?: ILearnset;
  game?: IGame;
}
