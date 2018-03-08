import { rummy } from './index';
import helpfulhints from './helpfulhints';
import { discard } from '../constants';
import { playerDiscard } from '../actions';
import { getOffset } from '../utils';

const player = Object.create(rummy);
player.takeFromDeck = function(e) {
  let i = false;
  this.togglebutton(e.target);
  const topFromDeck = this.DOMdeck.lastElementChild;

  topFromDeck.classList.add('player', 'temp', 'speedUpAnimation');
  //fix this
  topFromDeck.style.transform = 'translate(-50px, 230px)';
  topFromDeck.addEventListener('transitionend', event => {
    if (!i) {
      this.flipcards('top-card', topFromDeck);
      i = true;
    }
  });
};

player.flipcards = function(whichCard, ele) {
  ele.classList.add('flipchild');
  let i = false;
  ele.addEventListener('transitionend', e => {
    if (!i) {
      ele.removeAttribute('style');
      ele.classList.remove('temp', 'speedUpAnimation');
      ele.classList.add('delt');
      this.DOMplayerArea.prepend(ele);
      // this.store.dispatch(flipNewDeck('flippedDeck')); added new card
      this.toggleDiscardState();
      i = true;
    }
  });
};
//clean fix this up
player.takeFromPile = function(e) {
  if (e.target.classList.contains('take')) {
    let i = false;
    e.target.classList.remove('take');
    e.target.textContent = discard;
    e.target.parentElement.classList.remove('taketopCard');
    let card = e.target.parentElement.parentElement;
    console.log(getOffset(card));
    console.log(getOffset(this.DOMplayer));
    var test = getOffset(card).left - getOffset(this.DOMplayer).left;
    console.log(test);
    card.classList.add('player', 'speedUpAnimation');
    //card.style.transform = 'translate(-250px, 198px)'; //fix this !!!!
    card.style.transform = 'translate(' + -test + 'px, 198px)';

    card.addEventListener('transitionend', e => {
      if (!i) {
        card.removeAttribute('style');
        card.classList.remove(
          'temp',
          'speedUpAnimation',
          'showdacard',
          'junkpile'
        );
        this.DOMplayerArea.prepend(card);
        this.toggleDiscardState();
        // dispatch event
        i = true;
      }
    });
  }
};

player.toggleDiscardState = function() {
  Array.from(this.DOMplayerArea.querySelectorAll('.wrapper')).forEach(
    (ele, i) => {
      ele.querySelector('a').classList.toggle('show');
    }
  );
};

player.preDiscardCard = function(e) {
  if (e.target.classList.contains('show')) {
    const card = e.target.parentElement.parentElement;
    this.toggleDiscardState();
    this.discard(card);
    e.preventDefault();
  }
};

player.discard = function(card) {
  this.DOMJunkPileContainer.append(card);
  this.store.dispatch(playerDiscard());
};

player.userEvents = function() {
  this.DOMtakeCardButton.addEventListener(
    'click',
    this.takeFromDeck.bind(this)
  );

  this.DOMJunkPileContainer.addEventListener(
    'click',
    this.takeFromPile.bind(this)
  );
  //this.DOMknockButton.addEventListener('click', this.playerKnock.bind(this));
  this.DOMplayerArea.addEventListener('click', e => {
    if (e.target.classList.contains('show')) {
      this.preDiscardCard(e);
    }
  });
};
export { player };
