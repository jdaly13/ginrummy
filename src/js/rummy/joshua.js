//computer player
import { rummy } from './index';
import { joshuaDiscard } from '../actions';
import { getOffset } from '../utils';
const joshua = Object.create(rummy);

function procureHand() {
  return this.DOMcomp_playerArea.querySelectorAll('.wrapper');
}

joshua.cardToDiscard = null;
joshua.frontOfcardToDiscard = null;

joshua.chooseWisely = function(discardcard) {
  const topFromDeck = this.DOMdeck.lastElementChild;
  const mostRecentJunkPile = this.DOMJunkPileContainer.lastElementChild;
  return {
    card: discardcard ? mostRecentJunkPile : topFromDeck,
    junkPile: discardcard ? true : false
  };
};

joshua.takeCardProcess = function() {
  let cardToTakeObj;
  this.store.subscribe(() => {
   // console.log(this.store.getState().game.playerDiscard);
    if (this.store.getState().game.playerDiscard) {
      window.setTimeout(() => {
        var doesJoshuatakeTopDiscardedcar = this.decideWhichCard(
          procureHand.call(this),
          'dowetakediscardcard'
        );
        cardToTakeObj = this.chooseWisely(doesJoshuatakeTopDiscardedcar);
        this.addCardToJoshuaHand(cardToTakeObj.card, cardToTakeObj.junkPile);
      }, 1000);
    }
  });
};

joshua.addCardToJoshuaHand = function(card, junkPile) {
  let whatCard;
  let i = false;
  //console.log(card, this.DOMcomp_playerArea);
  let position = getOffset(card).left - getOffset(this.DOMcomp_playerArea).left;
  card.classList.remove('flipchild', 'player', 'speedUpAnimation');
  card.classList.add('comp_player', 'temp');
  if (junkPile) {
    card.style.transform = 'translate(' + -position + 'px, -200px)';
  } else {
    card.style.transform = 'translate(0px, -200px)';
  }
  card.addEventListener('transitionend', e => {
    if (!i) {
      card.removeAttribute('style');
      this.DOMcomp_playerArea.append(card);
      this.frontOfcardToDiscard = this.decideWhichCard(procureHand.call(this));
      if (this.frontOfcardToDiscard.computerKnock) { // computer knocked
        this.frontOfcardToDiscard = this.frontOfcardToDiscard.frontSideOfCardToBeDiscarded;
        this.cardToDiscard = this.frontOfcardToDiscard.parentElement;
        this.discardOfCard();
        this.decideWhichCard(this.DOMplayer.querySelectorAll('.wrapper'), 'getFirstPlayerScore'); //find first player Score
      } else {
        this.cardToDiscard = this.frontOfcardToDiscard.parentElement;
        this.discardOfCard();
      }
      i = true;
    }
  });
};

joshua.discardOfCard = function() {
  let anchor = this.frontOfcardToDiscard.querySelector('a');
  this.frontOfcardToDiscard.classList.add('taketopCard');
  anchor.textContent = 'TAKE';
  anchor.classList.add('take');
  this.DOMJunkPileContainer.append(this.cardToDiscard);
  this.cardToDiscard.classList.add('showdacard', 'flipchild');
  //if joshua knocks don't do next two steps TO DO
  this.store.dispatch(joshuaDiscard());
  this.togglebutton();
};
export { joshua };
