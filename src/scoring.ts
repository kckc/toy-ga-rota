import CONFIG from './config';
import * as PEOPLE from './people';
import {options} from './util';
import * as _ from 'lodash';

var scoringMethods: ((solution: string[])=>number)[] = [
    averageWorkLoad,
    lessConsecativeDays
]

export function calculateScore(solution)
{
    var scores = scoringMethods.map(func => func(solution));
    return scores.reduce((prev, curr, i) => prev + (curr * CONFIG.scoreWeights[i]), 0);
}

function averageWorkLoad(solution) {
    let score: number = 0;
    // average out workload for everyone
    PEOPLE.names.forEach((name) => {
        var count = _.filter(solution, (s) => s === name).length;
        score += Math.pow(Math.abs(count - options.length/PEOPLE.names.length), 2);
    })

    return score;
}

export function lessConsecativeDays(solution) {
    let score: number = 0;
    let chunks = _.chunk(solution, CONFIG.sessions.length);
    // less consecative days
    PEOPLE.names.forEach((name) => {
        let array = chunks.map((chunk) => _.filter(chunk, (c) => c === name).length);
        
        let internal_score = array.reduce((sum, curr, i, arr) => {
            var prev = i > 0 ? arr[i-1] : 0;
            var aggregate = prev > 0 ? curr * 10 : curr;
            // console.log(prev, sum, aggregate);
            return sum + aggregate;
        }, 0);

        // console.log(array, internal_score);

        score += internal_score;
    })

    return score;
}