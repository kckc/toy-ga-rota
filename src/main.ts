import { CONFIG } from './config';
import * as _ from 'lodash';
import {table, getBorderCharacters} from 'table';
import * as UTIL from './util';
import * as PEOPLE from './people';
import { calculateScore } from './scoring';
import { validateAll } from './validation';

export {
    main,
    printSolution,
};

function main() {

  const gen0 = generateSolutions(CONFIG.colonySize);

// console.log(gen0);

  const score0 = gen0.map(mapToScores);

  console.log(score0);

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

    const mutated = reduced.map((s, i) =>
        i > 1 ?
        UTIL.mutate(s, CONFIG.mutationCount, CONFIG.fixedFromBeginning.length) : s,
    );

    const repopulated = mutated.concat(generateSolutions(CONFIG.colonySize - reduced.length));

    const nextGen = repopulated.map(mapToScores);

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

  // const maxPad = _.maxBy(PEOPLE.names.map(name => Buffer.from(name)), 'length').length;
  const chunkByDate = _.chunk(score.s, CONFIG.sessions.length);
  const printObjByDate = chunkByDate.map((d, i) => [CONFIG.dates[i]].concat(d));
  console.log(table(printObjByDate, getTableConfig()))
  // printObjByDate.forEach((dateObj) => {
  //   const content = dateObj.map((o, i) => i === 0 ? o : _.padStart(o, maxPad)).join(' | ');
  //   console.log(`| ${content} |`);
  // });

  const personTimeline = chunkByDate.reduce(
    (prev, curr) => {
      PEOPLE.names.forEach(name => {
        if (prev[name]) {
          prev[name] += curr.includes(name) ? 'x' : '-'
        } else {
          prev[name] = curr.includes(name) ? 'x' : '-'
        }
      })
      return prev
    },
    {})
    console.log(table(_.toPairs(personTimeline), getTableConfig()));
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

function getTableConfig() {
  return {
    border: {
      ...getBorderCharacters(`void`),
      // bodyLeft: `│`,
      // bodyRight: `│`,
      // bodyJoin: `|`,
    },
    drawHorizontalLine: () => {
      return false
    }
  }
}