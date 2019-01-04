import { CONFIG } from './config';
import * as PEOPLE from './people';
import * as _ from 'lodash';

export function validateAll(solution: string[]) {
  return validateMethods.every(valid => valid(solution));
}

const validateMethods = [
  validateNameNotRepeatedInSameSession,
  validatePeopleIsNotOverSetLimit,
];

function validateNameNotRepeatedInSameSession(solution: string[]) {
  const units = _.chunk(solution, CONFIG.sessions.length);

  const result = !units.some((u) => {
    const count = _.filter(CONFIG.sessions, s => s[1] === 'AM').length;
    const am = _.take(u, count);
    const pm = _.takeRight(u, u.length - am.length);
    const isRepeated = (am.length !== _.uniq(am).length) || (pm.length !== _.uniq(pm).length);
        // console.log(am, pm, isRepeated);
    return isRepeated;
  });
    // console.log(solution, units, result);
  return result;
}

function validatePeopleIsNotOverSetLimit(solution: string[]) {
  const count = _.countBy(solution);

    // console.log(count, PEOPLE.limits);

  return PEOPLE.limits.every(setLimit => count[setLimit.name] <= setLimit.limit);
}
