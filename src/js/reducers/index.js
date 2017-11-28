import { combineReducers } from 'redux';
import game from './game'
import score from './score'

export default combineReducers({
	score,
	game
})