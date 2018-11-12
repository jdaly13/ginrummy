export function updateScore (text) {
	return {
		type: 'UPDATE_SCORE',
		text
	}
}

export function findFirstPlayerTotalValue (value) {
	return {
		type:'FIRST_PLAYER_FINAL_VALUE',
		value
	}
}

export function findJoshuaTotalValue(value) {
	return {
		type: 'JOSHUA_FINAL_VALUE',
		value
	}
}