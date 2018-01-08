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

export function crossover(solution1: string[], solution2: string[], limit: number) {

    var s1: string[], s2: string[];
    s1 = s2 = solution1.map(() => "");
    var trial = 0;
    while ((!validateConstraint1(s1) || !validateConstraint1(s2)))
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

export function randomIndex(array: any[]) {
    return Math.floor(Math.random() * array.length);
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
    var score = 0;
    PEOPLE.names.forEach((name) => {
        var count = _.filter(solution, (s) => s === name).length;
        score += Math.pow(Math.abs(count - options.length/PEOPLE.names.length), 2);
    })

    return score;
}

export function padName(name: string) {
    let max = _.maxBy(PEOPLE.names, 'length').length;
    // console.log(max, PEOPLE.names);
    return _.padStart(name, max + 1) + " |";
}