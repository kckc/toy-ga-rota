import CONFIG from './config'
import * as _ from 'lodash'

interface IPerson {
    [name: string]: {PA:number, PO:number, AM:number, PM:number, unavailable:number[]}
}

const people: IPerson = require('../res/people.json');

export var roles = {
    PA: _.toPairs(people).filter((p) => !!p[1].PA).map((p) => p[0]),
    PO: _.toPairs(people).filter((p) => !!p[1].PO).map((p) => p[0]),
    AM: _.toPairs(people).filter((p) => !!p[1].AM).map((p) => p[0]),
    PM: _.toPairs(people).filter((p) => !!p[1].PM).map((p) => p[0])
}

export var names = _.keys(people);

export var peopleAvailability = CONFIG.dates.map((date, i) => {
        return _.toPairs(people).filter((p) => !_.includes(p[1].unavailable, i)).map((p) => p[0]);
})

export function getPeopleAvailabilities() {
    return _.values(people)
        .map((p) => {
            let available = [];
            CONFIG.dates.forEach((d, i) => {
                if (_.includes(p.unavailable, i)) available.push[i];
            });
            return available;
        });
}