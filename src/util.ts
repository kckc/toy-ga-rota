import * as PEOPLE from './people';
import CONFIG from './config';
import { calculateScore } from './scoring';
import { validateAll } from './validation';
import * as _ from 'lodash';
import { join } from 'path';

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

    while (!validateAll(result))
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
    while (!validateAll(s1) || !validateAll(s2) || oldScore < newScore)
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

export function orderSameSession(solution: string[]) {
    const sessionKey: {[key: string]: number[]} = CONFIG.sessions.reduce((prev, next, i) => {
        const key = next.join('');
        if (prev[key]) {
            prev[key].push(i);
        } else {
            prev[key] = [i];
        }
        return prev;
    }, {})

    const sameSessionIndexes = Object.values(sessionKey).filter(k => k.length > 1);

    if (sameSessionIndexes.length === 0) {
        return solution;
    }

    const reorder = (chunk: string[]) => {
        let newOrder = [...chunk];
        sameSessionIndexes.forEach((indexes: number[]) => {
            const itemsToOrder = indexes.map(i => chunk[i]);
            const order = itemsToOrder.sort();
            indexes.forEach((_, i) => newOrder[indexes[i]] = order[i]);
        })
        return newOrder;
    }

    const orderedSolution = [];

    _.chunk(solution, CONFIG.sessions.length).forEach(chunk => {
        orderedSolution.push(...reorder(chunk));
    });

    return orderedSolution;
}