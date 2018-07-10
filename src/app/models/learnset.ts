import { IGame, IGeneration, IPokemon, IMove } from ".";

export interface ILearnset {
  id?: number;
  level: number;
  onEvo: boolean;
  byTM: boolean;
  moveId: number;
  move?: IMove;
}

export interface IPokemonLearnset {
  id?: number;
  genIntroducedId: number;
  genCompletedId: number;
  pokemonId: number;
  learnsetId: number;
  gameId: number;
  genIntroduced?: IGeneration;
  genCompleted?: IGeneration;
  pokemon?: IPokemon;
  learnset?: ILearnset;
  game?: IGame;
}
