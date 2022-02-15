import {
    NumberDictionary,
    adjectives,
    colors,
    names,
    starWars,
    uniqueNamesGenerator
} from 'unique-names-generator'

const numberDictionary = NumberDictionary.generate({ min: 100, max: 9999 })
const improvedAdjectives = [
    ...adjectives,
    'abrasive',
    'brash',
    'callous',
    'daft',
    'eccentric',
];
const myNames = [
    ...names,
    ...starWars,
    'professorX',
    'beast',
    'colossus',
    'cyclops',
    'iceman',
    'wolverine',
];

/**
 * @type {import("unique-names-generator").Config}
 */
const userNameConfig = {
    dictionaries: [
        improvedAdjectives,
        myNames,
        numberDictionary
    ]
}
/**
 * @type {import("unique-names-generator").Config}
 */
const plansConfig = {
    dictionaries: [
        adjectives,
        numberDictionary,
    ],
    separator: "_",
    style: "lowerCase",
    length: 2

}

export function generateUserName() {
    return uniqueNamesGenerator(userNameConfig)
}

export function generatePlanName() {
    return uniqueNamesGenerator(plansConfig)
}