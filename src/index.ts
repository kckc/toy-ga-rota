import { CONFIG } from './config';
import * as _ from 'lodash';
import * as UTIL from './util';
import * as PEOPLE from './people';
import { calculateScore } from './scoring';
import { validateAll } from './validation';

const winner = main();

printSolution(winner);

export {
    main,
    printSolution,
};

function main() {
// console.log(_.fromPairs(
//     UTIL.options.map((option, i) => {
//         var date_index = Math.floor(i/CONFIG.sessions.length);
//         var session_index = i % CONFIG.sessions.length;
//         // console.log(option, i, date_index, session_index);

//         var key = CONFIG.dates[date_index]
//             + " " + CONFIG.sessions[session_index].join(" ")
//             + " " + session_index;
//         return [key, option]
//     }))
// );

  const gen0 = generateSolutions(CONFIG.colonySize);

// console.log(gen0);

  const score0 = gen0.map(mapToScores);

  console.log(score0);

// var cx = crossover(gen0[0], gen0[1], validateAll, 2);

// console.log(cx);

// var scorecx = cx.map(calculateScore);

// console.log(scorecx);

  let generation = 0;
  let scores = score0;

  while (generation < CONFIG.maxGen) {
    const sortedSolutions = _.sortBy(scores, s => s.score).map(s => s.s);

    const cross1 = UTIL.crossover(
        sortedSolutions[0], sortedSolutions[2], sortedSolutions[0].length);
    const cross2 = UTIL.crossover(
        sortedSolutions[1], sortedSolutions[3], sortedSolutions[0].length);

    const swapped = _.take(sortedSolutions, scores.length - 4)
        .concat(cross1)
        .concat(cross2);

    const reduced = _.uniqBy(swapped, s => s.join(''));

    const repopulated = reduced.concat(generateSolutions(CONFIG.colonySize - reduced.length));

    const mutated = repopulated.map((s, i) =>
        i > 1 ?
        UTIL.mutate(s, CONFIG.mutationCount, CONFIG.fixedFromBeginning.length) : s,
    );

    const nextGen = mutated.map(mapToScores);

    generation += 1;
    console.log(`======= Gen: ${generation}`);
    console.log(_.sortBy(nextGen.map(s => s.score)));

    scores = nextGen;
  }

  const winner = _.minBy(scores, s => s.score);
  const orderedWinner = {
    s: UTIL.orderSameSession(winner.s),
    score: winner.score,
  };

  return orderedWinner;
}

function printSolution(score: {s:string[], score:number}) {
  console.log(score.s);
  console.log(_.sortBy(_.toPairs(_.countBy(score.s)), s => -s[1]));
  console.log(score.score);

  const maxPad = _.maxBy(PEOPLE.names.map(name => Buffer.from(name)), 'length').length;
  const chunkByDate = _.chunk(score.s, CONFIG.sessions.length);
  const printObjByDate = chunkByDate.map((d, i) => [CONFIG.dates[i]].concat(d));
  printObjByDate.forEach((dateObj) => {
    const content = dateObj.map((o, i) => i === 0 ? o : _.padStart(o, maxPad)).join(' | ');
    console.log(`| ${content} |`);
  });
    // printObjByDate.forEach(d => console.log(d.join('\t')))
}

function mapToScores(s: string[]) {
  return { s, score: calculateScore(s) };
}

function generateSolutions(count: number) {
  const solutions = [];
  for (let i = 0; i < count; i += 1) {
    let solution = generateSolution();
    while (!validateAll(solution)) {
      solution = generateSolution();
    }

    solutions.push(solution);
  }
  return solutions;
}

function generateSolution() {
  let solution = [];
  solution = solution.concat(CONFIG.fixedFromBeginning);
  UTIL.options.forEach((option, i) => {
    if (i < CONFIG.fixedFromBeginning.length) return;
    const index = UTIL.randomIndex(option);
    solution.push(option[index]);
  });
  return solution;
}
