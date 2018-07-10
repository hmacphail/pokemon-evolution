import { IGeneration } from ".";

export interface IType {
  id?: number;
  name: string;
}

export interface IEffectiveness {
  id?: number;
  comparison: EffectComparison;
  genIntroducedId: number;
  genCompletedId: number;
  attackingTypeId: number;
  defendingTypeId: number;
  genIntroduced?: IGeneration;
  genCompleted?: IGeneration;
  attackingType?: IType;
  defendingType?: IType;
}

export enum EffectComparison {
  Strong = "strong",
  Neutral = "neutral",
  Weak = "weak",
  Unaffected = "unaffected"
}
