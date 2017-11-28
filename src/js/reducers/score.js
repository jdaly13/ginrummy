/*import {
	SCORE_CURRENT_UPDATE,
	SCORE_CURRENT_CLEAR,
	SCORE_ADD
} from '../constants/score'
*/
//import { updateScoreList } from '../utils'

const initialState = {
	current: 0,
	all: []
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
	default:
		return state
	}
}