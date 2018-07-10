import { IGeneration } from ".";

export interface IGame {
  id?: number;
  code: string;
  name: string;
  generationId: number;
  generation?: IGeneration;
}
