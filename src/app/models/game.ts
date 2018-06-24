import { IGeneration } from ".";

export interface IGame {
  id: number;
  code: string;
  description: string;
  generation?: IGeneration;
}
