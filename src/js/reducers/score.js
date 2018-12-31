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
	firstPlayerObj: {},
	joshuaValue:0,
	joshuaFinalObj: {}

}

export default function score (state = initialState, action) {
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
	case 'STORE_FINAL_JOSHUA_OBJECT':
		return Object.assign({}, state, {
			joshuaFinalObj: action.value
		})
	case 'STORE_FINAL_FIRST_PLAYER_OBJECT':
		return Object.assign({}, state, {
			firstPlayerObj: action.value
		})
	default:
		return state
	}
}