import * as CONFIG from './config';
import * as _ from 'lodash';

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

    var cross1 = crossover(sorted[0].s,sorted[2].s, validateConstraint1, sorted[0].s.length);
    var cross2 = crossover(sorted[1].s,sorted[3].s, validateConstraint1, sorted[0].s.length);

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
    for (var i=0; i<CONFIG.spaces; i++) {
        var index = randomIndex(CONFIG.availabililty[i]);
        solution.push(CONFIG.availabililty[i][index]);
    }
    return solution;
}

function validateConstraint1(solution) {
    let units = _.chunk(solution, CONFIG.unitSize);

    let result = !units.some((u) => {
        return u.length !== _.uniq(u).length;
    });
    //console.log(solution, units, result);
    return result;
}

function calculateScore(solution)
{
    var score = 0;
    CONFIG.names.forEach((name, i) => {
        var count = _.filter(solution, (s) => s === i+1).length;
        score += Math.pow(Math.abs(count - CONFIG.spaces/CONFIG.names.length), 2);
    })

    return score;
}

function crossover(solution1: number[], solution2: number[], verifyAllFunc, limit: number) {

    var s1: number[], s2: number[];
    s1 = s2 = solution1.map(() => 1);
    var trial = 0;
    while ((!verifyAllFunc(s1) || !verifyAllFunc(s2)))
    {
        let xpoint = randomIndex(solution1);

        s1 = [], s2 = [];
        solution1.forEach((point, i) => {
            if (i<xpoint)
            {
                s1.push(solution1[i]);
                s2.push(solution2[i]);
            }
            else
            {
                s1.push(solution2[i]);
                s2.push(solution1[i]);
            }
        });
        // console.log(s1, s2, solution1, solution2, xpoint);
        if (trial++ > limit) return [solution1, solution2];
    }

    return [s1, s2];
}

function randomIndex(array: any[]) {
    return Math.floor(Math.random() * array.length);
}
