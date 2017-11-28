import { createStore } from 'redux'
import reducers from '../reducers'
//import { loadState } from '../utils'
export * from './connect'


export default function configureStore (persistedState = window.localStorage) {
	return createStore(
		reducers,
		persistedState
	)
}

