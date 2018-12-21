const initialState = {
  delt: false,
  cardsFlipped: false,
  reshuffled: false,
  index: 0,
  deck: false,
  playerDiscard: false,
  joshuaDiscard: false,
  noOfCardsDiscarded: 0,
  playerKnock: false
};

let index = 0;

export default function game(state = initialState, action) {
  console.log(state, action);
  switch (action.type) {
    case 'CARDS_DELT':
      return Object.assign({}, state, {
        delt: true
      });
    case 'FLIP_NEW_DECK':
      return Object.assign({}, state, {
        cardsFlipped: true
      });
    case 'RESHUFFLE':
      return Object.assign({}, state, {
        reshuffled: true,
        index: state.index++
      });
    case 'DECK_CREATED':
      return Object.assign({}, state, {
        deck: true
      });
    case 'DISCARD_CARD':
      return Object.assign({}, state, {
        playerDiscard: !state.playerDiscard,
        noOfCardsDiscarded: ++state.noOfCardsDiscarded
      });
    case 'JOSHUA_DISCARD_CARD':
      //if action.value it's end of game so we don't toggle playerDiscardState
      console.log('jsohuadiscardcard');
      return Object.assign({}, state, {
        joshuaDiscard: !state.joshuaDiscard,
        playerDiscard: action.value === "endOfGame" ? false : !state.playerDiscard,
        noOfCardsDiscarded: ++state.noOfCardsDiscarded
      });
    case 'PLAYER_KNOCK': 
      return Object.assign({}, state, {
        playerKnock: !state.playerKnock
      });
    default:
      return state;
  }
}
