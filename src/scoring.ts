import { CONFIG } from './config';
import * as PEOPLE from './people';
import { options } from './util';
import * as _ from 'lodash';

const scoringMethods: ((solution: string[]) => number)[] = [
  averageWorkLoad,
  lessConsecativeDays,
];

export function calculateScore(solution) {
  const scores = scoringMethods.map(func => func(solution));
  return scores.reduce((prev, curr, i) => prev + (curr * CONFIG.scoreWeights[i]), 0);
}

function averageWorkLoad(solution) {
  let score: number = 0;
    // average out workload for everyone
  PEOPLE.names.forEach((name) => {
    const count = _.filter(solution, s => s === name).length;
    score += Math.pow(Math.abs(count - options.length / PEOPLE.names.length), 2);
  });

  return score;
}

export function lessConsecativeDays(solution) {
  let score: number = 0;
  const chunks = _.chunk(solution, CONFIG.sessions.length);
    // less consecative days
  PEOPLE.names.forEach((name) => {
    const array = chunks.map(chunk => _.filter(chunk, c => c === name).length);

    const internalScore = array.reduce(
      (sum, curr, i, arr) => {
        const prev = i > 0 ? arr[i - 1] : 0;
        const aggregate = prev > 0 ? curr * 10 : curr;
              // console.log(prev, sum, aggregate);
        return sum + aggregate;
      },
      0,
    );

        // console.log(array, internalScore);

    score += internalScore;
  });

  return score;
}
