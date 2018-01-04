import * as PEOPLE from './people'
import * as _ from 'lodash'

export const names = [
    "A",
    "B",
    "C",
    "D"
]

export const availabililty = [
    [1,2,3,4],
    [1,3,4],
    [2,3,4],
    [4]
]

export var spaces = availabililty.length

export const unitSize = 2

export const colonySize = 10

export const maxGen = 10

function getNames() {
    return PEOPLE.people
}

function getAvailabilities() {
    // return _.values(PEOPLE.people).map((p) => p.unavailable).map((u:number[]) => _.without(PEOPLE.dates, u))
}