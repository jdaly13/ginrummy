//computer player
import { rummy } from './index';
import { joshuaDiscard, playerDiscard } from '../actions';
const joshua = Object.create(rummy);

function procureHand() {
  return this.DOMcomp_playerArea.querySelectorAll('.wrapper');
}

joshua.cardToDiscard = null;
joshua.frontOfcardToDiscard = null;

joshua.chooseWisely = function(discardcard) {
  const topFromDeck = this.DOMdeck.lastElementChild;
  const mostRecentJunkPile = this.DOMJunkPileContainer.lastElementChild;
  return discardcard ? mostRecentJunkPile : topFromDeck;
};

joshua.takeCardProcess = function() {
  let cardToTake;
  this.store.subscribe(() => {
    console.log(this.store.getState().game.playerDiscard);
    if (this.store.getState().game.playerDiscard) {
      window.setTimeout(() => {
        var doesJoshuatakeTopDiscardedcar = this.decideWhichCard(
          procureHand.call(this),
          'dowetakediscardcard'
        );
        cardToTake = this.chooseWisely(doesJoshuatakeTopDiscardedcar);
        this.addCardToJoshuaHand(cardToTake);
      }, 1000);
    }

    if (this.store.getState().game.joshuaDiscard) {
      this.cardToDiscard.style.left = `${
        this.store.getState().game.increment
      }px`;
    }
  });
};

joshua.addCardToJoshuaHand = function(card) {
  let whatCard;
  let i = false;
  card.classList.remove('flipchild', 'player', 'speedUpAnimation');
  card.classList.add('comp_player', 'temp');
  card.style.transform = 'translate(1000px, -200px)'; //fix this
  card.addEventListener('transitionend', e => {
    if (!i) {
      card.removeAttribute('style');
      this.DOMcomp_playerArea.append(card);
      //this.store.dispatch();
      this.frontOfcardToDiscard = this.decideWhichCard(procureHand.call(this));
      this.cardToDiscard = this.frontOfcardToDiscard.parentElement;
      this.discardOfCard();
      i = true;
    }
  });
};

joshua.discardOfCard = function() {
  console.log('discardOfCard');
  let anchor = this.frontOfcardToDiscard.querySelector('a');
  this.frontOfcardToDiscard.classList.add('taketopCard');
  anchor.textContent = 'TAKE';
  anchor.classList.add('take');
  this.DOMJunkPileContainer.append(this.cardToDiscard);
  this.cardToDiscard.classList.add('showdacard', 'flipchild');
  this.store.dispatch(joshuaDiscard());
  this.togglebutton();
};
export { joshua };
