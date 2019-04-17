import { cardSuits } from '../constants';
import { one_suit, createDeckOfCards } from '../utils';
import RUMMY from './RUMMY';
export const rummy = Object.assign(RUMMY.prototype, {
  deckofcards: createDeckOfCards(cardSuits, one_suit),
  DOMbubble: document.querySelector('.bubble'),
  DOMplayer: document.getElementById('player'),
  DOMplayerArea: document.getElementById('area'),
  DOMcomp_player: document.getElementById('comp_player'),
  DOMcomp_playerArea: document.getElementById('comp_area'),
  DOMdeck: document.getElementById('deck'),
  DOMJunkPileContainer: document.getElementById('junkpileArea'),
  DOMIntroNIframe: document.getElementById('intro'),
  //buttons
  DOMdealCardsButton: document.getElementById('deal'),
  DOMtakeCardButton: document.getElementById('takeCard'),
  DOMreshuffleButton: document.getElementById('reshuffle'),
  DOMknockButton: document.getElementById('knock')
});
