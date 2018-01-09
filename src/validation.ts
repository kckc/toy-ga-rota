import CONFIG from './config';
import * as PEOPLE from './people';
import * as _ from 'lodash';

export function validateAll(solution: string[]) {
    return validateMethods.every(valid => valid(solution));
}

var validateMethods = [
    validateNameNotRepeatedInSameSession,
    validatePeopleIsNotOverSetLimit
]

function validateNameNotRepeatedInSameSession(solution: string[]) {
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

function validatePeopleIsNotOverSetLimit(solution: string[]) {
    let count = _.countBy(solution);

    // console.log(count, PEOPLE.limits);

    return PEOPLE.limits.every((setLimit) => count[setLimit.name] <= setLimit.limit);
}
