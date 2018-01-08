import * as PEOPLE from './people';
import CONFIG from './config';
import * as _ from 'lodash';

function constructAvailabilities(): any[][] {
    let availability: any[][] = [];
    CONFIG.dates.forEach((date, i) => {
        let roles = CONFIG.sessions.map((session) => {
            // console.log(session, PEOPLE.roles, PEOPLE.roles['PA']);
            return _.intersection(PEOPLE.roles[session[0]], PEOPLE.roles[session[1]], PEOPLE.peopleAvailability[i]);
        });
        // console.log(availability);
        availability = availability.concat(roles);
    })
    return availability;
}

export var options = constructAvailabilities();

export function mutate(solution: string[], amount: number, fixed: number = 0) {
    let mutate_index = _.times(amount, () => randomIndex(solution, fixed));

    if (mutate_index.length > solution.length)
        mutate_index = _.take(mutate_index, solution.length);

    let result = _.map(solution, _.clone);
    
    mutate_index.forEach((i) => {
        result[i] = options[i][randomIndex(options[i])];
    });

    while (!validateConstraint1(result))
        mutate_index.forEach((i) => {
            result[i] = options[i][randomIndex(options[i])];
        });

    return result;
}

export function crossover(solution1: string[], solution2: string[], limit: number) {

    var s1: string[], s2: string[];
    s1 = s2 = solution1.map(() => "");
    var trial = 0,
        newScore = 0, 
        oldScore = calculateScore(solution1) + calculateScore(solution2);
    while (!validateConstraint1(s1) || !validateConstraint1(s2) || oldScore < newScore)
    {
        let xaddress = _.times(CONFIG.crossoverPoints, ()=>randomIndex(solution1)).sort();

        s1 = _.slice(solution1,0,xaddress[0]).concat(_.slice(solution2, xaddress[0]));
        s2 = _.slice(solution2,0,xaddress[0]).concat(_.slice(solution1, xaddress[0]));
        
        _.tail(xaddress).forEach((address) => {
            s1 = _.slice(solution1,0,address).concat(_.slice(solution2, address));
            s2 = _.slice(solution2,0,address).concat(_.slice(solution1, address));
        })
        newScore = calculateScore(s1) + calculateScore(s2);

        // console.log(s1, s2, solution1, solution2, xpoint);
        if (trial++ > limit) return [solution1, solution2];
    }

    return [s1, s2];
}

export function randomIndex(array: any[], from: number = 0) {
    return Math.floor(Math.random() * (array.length - from)) + from;
}

export function validateConstraint1(solution) {
    let units = _.chunk(solution, CONFIG.sessions.length);

    let result = !units.some((u) => {
        let count = _.filter(CONFIG.sessions, (s) => s[1] === "AM").length;
        let am = _.take(u, count);
        let pm = _.takeRight(u, u.length - am.length);
        let isRepeated = (am.length !== _.uniq(am).length) || (pm.length !== _.uniq(pm).length);
        // console.log(am, pm, isRepeated);
        return isRepeated;
    });
    //console.log(solution, units, result);
    return result;
}

export function calculateScore(solution)
{
    var scores = _.map(CONFIG.initScore, _.clone);
    var weights = _.map(CONFIG.scoreWeights, _.clone);

    // average out workload for everyone
    PEOPLE.names.forEach((name) => {
        var count = _.filter(solution, (s) => s === name).length;
        scores[0] += Math.pow(Math.abs(count - options.length/PEOPLE.names.length), 2);
    })

    let chunks = _.chunk(solution, CONFIG.sessions.length);
    // less consecative days
    PEOPLE.names.forEach((name) => {
        let array = chunks.map((chunk) => _.filter(chunk, (c) => c === name).length);

        let internal_score = array.reduce((sum, curr, i, arr) => {
            var prev = i > 0 ? arr[i-1] : 0;
            return sum + prev > 0 ? curr * 10 : curr;
        }, 0);

        scores[1] += internal_score;
    })
    

    return scores.reduce((prev, curr, i) => prev + (curr * weights[i]), 0);
}

export function padName(name: string) {
    let max = _.maxBy(PEOPLE.names, 'length').length;
    // console.log(max, PEOPLE.names);
    return _.padStart(name, max + 1) + " |";
}