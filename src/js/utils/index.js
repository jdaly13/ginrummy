import { cardArray } from '../constants';
function createCardValues () {
    const obj = {};
    obj.one_suit = {};
    obj.cardValues = {};
    cardArray.forEach((val, index) => {
        ++index;
        obj.one_suit[val] = (index > 9) ? 10 : index;
        obj.cardValues[val] = index;
    });
    return obj;
}
const cardValueObj = createCardValues();

export const {one_suit, cardValues} = cardValueObj;
export function createDeckOfCards (each_suit, one_suit) {
    const deck = {};
    each_suit.forEach((val) => {
        deck[val] = Object.create(one_suit);
    })
    return deck;
}
export function shuffle (array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}