import CONFIG from './config';
import * as _ from 'lodash';
import * as UTIL from './util';
import * as PEOPLE from './people';

console.log(_.fromPairs(
    UTIL.options.map((option, i) => {
        var date_index = Math.floor(i/CONFIG.sessions.length);
        var session_index = i % CONFIG.sessions.length;
        console.log(option, i, date_index, session_index);

        var key = CONFIG.dates[date_index]
            + " " + CONFIG.sessions[session_index].join(" ")
            + " " + session_index;
        return [key, option]
    }))
);

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

    var cross1 = UTIL.crossover(sorted[0].s,sorted[2].s, sorted[0].s.length);
    var cross2 = UTIL.crossover(sorted[1].s,sorted[3].s, sorted[0].s.length);

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
    return {s: s, score: UTIL.calculateScore(s)};
}

function generateSolutions(count: number) {
    var solutions = [];
    for (let i=0; i<count; i++) {
        let solution = generateSolution();
        while (!UTIL.validateConstraint1(solution))
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
