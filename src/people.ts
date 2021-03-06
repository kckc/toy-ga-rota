import { CONFIG } from './config';
import * as _ from 'lodash';

interface IPerson {
  [name: string]: {limit?: number, PAPOAMPM: string, unavailable:number[], maybe?: number[]};
}

export const people: IPerson = require('../res/people.json');

export let roles = {
  PA: _.toPairs(people).filter(p => (parseInt(p[1].PAPOAMPM, 2) & 0b1000) > 0).map(p => p[0]),
  PO: _.toPairs(people).filter(p => (parseInt(p[1].PAPOAMPM, 2) & 0b0100) > 0).map(p => p[0]),
  AM: _.toPairs(people).filter(p => (parseInt(p[1].PAPOAMPM, 2) & 0b0010) > 0).map(p => p[0]),
  PM: _.toPairs(people).filter(p => (parseInt(p[1].PAPOAMPM, 2) & 0b0001) > 0).map(p => p[0]),
};
// console.log(roles);
export let names = _.keys(people);

export let limits = _.toPairs(people)
    .filter(pair => _.isNumber(pair[1].limit))
    .map((pair) => { return { name:pair[0], limit:pair[1].limit }; });

export let peopleAvailability = CONFIG.dates.map((date, i) => {
  return _.toPairs(people).filter(p => !_.includes(p[1].unavailable, i)).map(p => p[0]);
});

export function getPeopleAvailabilities() {
  return _.values(people)
        .map((p) => {
          const available = [];
          CONFIG.dates.forEach((d, i) => {
            if (_.includes(p.unavailable, i)) available.push[i];
          });
          return available;
        });
}
