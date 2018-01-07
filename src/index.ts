import CONFIG from './config';
import * as _ from 'lodash';
import * as UTIL from './util';
import * as PEOPLE from './people';

var gen0 = generateSolutions(CONFIG.colonySize);

// console.log(gen0);

var score0 = gen0.map(mapToScores);

console.log(score0);

// var cx = crossover(gen0[0], gen0[1], validateConstraint1, 2);

// console.log(cx);

// var scorecx = cx.map(calculateScore);

// console.log(scorecx);

var generation = 0;
var scores = score0;

while(generation < CONFIG.maxGen)
{
    var sorted = _.sortBy(scores, (s) => s.score);

    var cross1 = UTIL.crossover(sorted[0].s,sorted[2].s, validateConstraint1, sorted[0].s.length);
    var cross2 = UTIL.crossover(sorted[1].s,sorted[3].s, validateConstraint1, sorted[0].s.length);

    var swapped = _.take(sorted, scores.length - 4)
        .concat(cross1.map(mapToScores))
        .concat(cross2.map(mapToScores));

    var reduced = _.uniqBy(swapped, (s) => s.s.join());
    
    var nextGen = reduced.concat(generateSolutions(CONFIG.colonySize - reduced.length).map(mapToScores));

    generation++;
    console.log("======= Gen: " + generation);
    console.log(_.sortBy(nextGen, (s) => s.score));

    scores = nextGen;
}

function mapToScores(s: number[]) {
    return {s: s, score: calculateScore(s)};
}

function generateSolutions(count: number) {
    var solutions = [];
    for (let i=0; i<count; i++) {
        let solution = generateSolution();
        while (!validateConstraint1(solution))
            solution = generateSolution();
        
        solutions.push(solution);
    }
    return solutions;
}

function generateSolution(){
    var solution = [];
    UTIL.options.forEach((day) => {
        let index = UTIL.randomIndex(day);
        solution.push(day[index]);
    });
    return solution;
}

function validateConstraint1(solution) {
    let units = _.chunk(solution, CONFIG.sessions.length);

    let result = !units.some((u) => {
        var am = _.take(u, 3);
        var pm = _.takeRight(u, 2);
        return (am.length !== _.uniq(am).length) && (am.length !== _.uniq(am).length);
    });
    //console.log(solution, units, result);
    return result;
}

function calculateScore(solution)
{
    var score = 0;
    PEOPLE.names.forEach((name) => {
        var count = _.filter(solution, (s) => s === name).length;
        score += Math.pow(Math.abs(count - UTIL.options.length/PEOPLE.names.length), 2);
    })

    return score;
}
