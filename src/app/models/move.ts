import { IGame, IGeneration, IType } from ".";

export interface IMove {
  id: number;
  name: string;
  pp: number;
  power: number;
  accuracy: number;
  category: MoveCategory;
  target: MoveTarget;
  speedPriority: number;
  baseCritHitChance: number;
  physicalContact: boolean;
  secondaryEffect: string;
  secondaryEffectRate: number;
  description: string;
  tmNumber: string;
  hmNumber: string;
  genIntroduced?: IGeneration;
  genCompleted?: IGeneration;
  commonMove?: IMove;
  game?: IGame;
  type?: IType;
  moveFlag?: IMoveFlag;
}

export interface IZMove {
  id: number,
  attack: number,
  zMove?: IMove,
  originalMove?: IMove
}

export interface IMoveFlag {
  id: number,
  blockable: boolean,
  reflectable: boolean,
  snatchable: boolean,
  copiedByMirrorMove: boolean,
  soundBased: boolean,
  punchBased: boolean,
  affectedByGravity: boolean,
  affectedByKingsRock: boolean
}

export enum MoveCategory {
  Physical = "physical",
  Special = "special",
  Status = "status"
}

export enum MoveTarget {
  Special = "special",
  User = "user",
  Ally = "ally",
  UserOrAlly = "user-or-ally",
  UsersField = "users-field",
  SelectedOpponent = "selected-opponent",
  RandomOpponent = "random-opponent",
  AdjacentOpponents = "adjacent-opponents",
  OpponentsField = "opponents-field",
  AllOthers = "all-others",
  EntireField = "entire-field"
}
