/*import {
	TETROMINO_ADD,
	TETROMINO_MOVE,
	TETROMINO_ROTATE
} from '../constants/tetromino'
*/

const initialState = {
	delt: false,
	cardsFlipped: false,
	reshuffled: false,
	index:  0,
	deck: false
}

let index = 0;

export default function game (state = initialState, action) {
	console.log(state, action)
	switch (action.type) {
	case "CARDS_DELT":
		return Object.assign({}, state, {
            delt: true
		})
	case "FLIP_NEW_DECK":
        return Object.assign({}, state, {
            cardsFlipped: true
        })
	case "RESHUFFLE":
		return Object.assign({}, state, { 
			reshuffled: true,
			index: state.index++
		 })
	case "DECK_CREATED":
		 return Object.assign({}, state, { 
			 deck: true
		  })
	default:
		return state
	}
}