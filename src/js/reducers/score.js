import { stat } from "fs";

/*import {
	SCORE_CURRENT_UPDATE,
	SCORE_CURRENT_CLEAR,
	SCORE_ADD
} from '../constants/score'
*/
//import { updateScoreList } from '../utils'

const initialState = {
	current: 0,
	all: [],
	firstPlayerValue: 0,
	joshuaValue:0
}

export default function score (state = initialState, action) {
	console.log(state, action);
	switch (action.type) {
	case 'UPDATE_CURRENT_SCORE':
		return Object.assign({}, state, {
			current: state.current + action.current
		})
	case 'CLEAR_CURRENT_SCORE':
		return Object.assign({}, state, {
			current: 0
		})
	case 'FIRST_PLAYER_FINAL_VALUE': 
		return Object.assign({}, state, {
			firstPlayerValue: action.value
		})
	case 'JOSHUA_FINAL_VALUE':
		return Object.assign({}, state, {
			joshuaValue: action.value
		})
	default:
		return state
	}
}