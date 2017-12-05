export function flipNewDeck (text) {
	return {
		type: 'FLIP_NEW_DECK',
		text
	}
}

export function reshuffle (text) {
	return {
		type: 'RESHUFFLE',
		text
	}
}

export function dealCards (text) {
	return {
		type: 'CARDS_DELT',
		text
	}
}

export function createDeck (text) {
    return {
        type: 'DECK_CREATED',
        text
    }
}