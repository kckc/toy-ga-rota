interface IConfig {
    colonySize: number;
    maxGen: number;
    crossoverPoints: number;
    dates: string[];
    sessions: string[][];
    fixedFromBeginning: string[];
    scoreWeights: number[];
}

var CONFIG: IConfig = require('../res/config.json');

export default CONFIG;

