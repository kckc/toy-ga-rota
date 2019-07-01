export interface IConfig {
  colonySize: number;
  maxGen: number;
  crossoverPoints: number;
  dates: string[];
  sessions: string[][];
  fixedFromBeginning: string[];
  scoreWeights: number[];
  mutationCount: number;
  newSessions: any;
}

export const CONFIG: IConfig = require('../res/config.json');
