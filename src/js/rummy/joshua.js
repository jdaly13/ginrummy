//computer player
import { rummy } from './index';

const joshua = Object.create(rummy);

function procureHand() {
  return this.DOMcomp_playerArea.querySelectorAll('.wrapper');
}

joshua.chooseWisely = function(discardcard) {
  const topFromDeck = this.DOMdeck.lastElementChild;
  const mostRecentJunkPile = this.DOMJunkPileContainer.lastElementChild;
  return discardcard ? mostRecentJunkPile : topFromDeck;
};

joshua.takeCardProcess = function() {
  let cardToTake;
  this.store.subscribe(() => {
    if (this.store.getState().game.playerDiscard) {
      window.setTimeout(() => {
        var doesJoshuatakeTopDiscardedcar = this.decideWhichCard(
          procureHand.call(this),
          'dowetakediscardcard'
        );
        console.log(doesJoshuatakeTopDiscardedcar);
        cardToTake = this.chooseWisely(doesJoshuatakeTopDiscardedcar);
        this.addCardToJoshuaHand(cardToTake);
      }, 1000);
    }
  });
};

joshua.addCardToJoshuaHand = function(card) {
  card.classList.remove('flipchild', 'player', 'speedUpAnimation');
  card.classList.add('comp_player', 'temp');
  card.style.transform = 'translate(1000px, -200px)';
  card.addEventListener('transitionend', e => {
    card.removeAttribute('style');
    this.DOMcomp_playerArea.append(card);
    //this.store.dispatch();
    this.decideWhichCard(procureHand.call(this));
  });
};

export { joshua };
