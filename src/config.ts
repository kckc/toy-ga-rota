// export const dates = ["01/10","08/10","15/10","22/10","29/10","05/11","12/11","19/11","26/11","03/12","10/12","17/12","24/12","31/12"]

interface IConfig {
    colonySize: number;
    maxGen: number;
    crossoverPoints: number;
    dates: string[];
    sessions: string[][];
    fixedFromBeginning: string[];
    initScore: number[];
    scoreWeights: number[];
}

var CONFIG: IConfig = require('../res/config.json');

export default CONFIG;

