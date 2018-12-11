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

export function storeFinalJoshuaObject(obj) {
	return {
		type: 'STORE_FINAL_JOSHUA_OBJECT',
		value: obj
	}
}

export function storeFinalFirstPlayerObject(obj) {
	return {
		type: 'STORE_FINAL_FIRST_PLAYER_OBJECT',
		value: obj
	}
}