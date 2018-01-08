import CONFIG from './config';
import * as _ from 'lodash';
import * as UTIL from './util';
import * as PEOPLE from './people';

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
    var sorted_solutions = _.sortBy(scores, (s) => s.score).map((s) => s.s);

    var cross1 = UTIL.crossover(sorted_solutions[0], sorted_solutions[2], sorted_solutions[0].length);
    var cross2 = UTIL.crossover(sorted_solutions[1], sorted_solutions[3], sorted_solutions[0].length);

    var swapped = _.take(sorted_solutions, scores.length - 4)
        .concat(cross1)
        .concat(cross2);

    var reduced = _.uniqBy(swapped, (s) => s.join(""));
    
    var repopulated = reduced.concat(generateSolutions(CONFIG.colonySize - reduced.length));

    var mutated = repopulated.map((s, i) => 
        i > 1 ? 
        UTIL.mutate(s, 5, CONFIG.fixedFromBeginning.length) : s
    );

    var nextGen = mutated.map(mapToScores);

    generation++;
    console.log("======= Gen: " + generation);
    console.log(_.sortBy(nextGen, (s) => s.score).map((s) => s.score));

    scores = nextGen;
}

printSolution(_.minBy(scores, (s) => s.score));

function printSolution(scores: {s:string[], score:number}) {
    var dates = _.chunk(scores.s, CONFIG.sessions.length)
    dates.forEach((d, i) => {
        console.log("|" + _.padStart(CONFIG.dates[i], 6) + " |"
         + d.map(UTIL.padName).join(""));
    })
    console.log(scores.score);
    console.log(_.countBy(scores.s));
}

function mapToScores(s: string[]) {
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
    solution = solution.concat(CONFIG.fixedFromBeginning);
    UTIL.options.forEach((option, i) => {
        if (i<CONFIG.fixedFromBeginning.length) return;
        let index = UTIL.randomIndex(option);
        solution.push(option[index]);
    });
    return solution;
}
