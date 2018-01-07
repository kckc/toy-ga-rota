import * as PEOPLE from './people';
import  CONFIG from './config';
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

export function crossover(solution1: number[], solution2: number[], verifyAllFunc, limit: number) {

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

export function randomIndex(array: any[]) {
    return Math.floor(Math.random() * array.length);
}
