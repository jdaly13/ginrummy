import { rummy } from './index';
import { secondBubbleHint, thirdBubbleHint } from '../constants';
const helpfulhints = Object.create(rummy);
helpfulhints.showHint = function(whichHint) {
  this.DOMbubble.classList.remove('hide');
  this.DOMbubble.removeAttribute('data-bubble');
  if (whichHint === 1) {
    this.DOMbubble.innerHTML = secondBubbleHint;
    this.DOMbubble.setAttribute('data-bubble', 'second');
    window.setTimeout(() => {
      this.DOMbubble.classList.add('animated');
    }, 0);
  }

  if (whichHint === 2) {
    this.DOMbubble.setAttribute('data-bubble', 'third');
    this.DOMbubble.innerHTML = thirdBubbleHint;
    this.DOMbubble.classList.remove('hide');
    window.setTimeout(() => {
      this.DOMbubble.classList.add('animated');
    }, 0);
  }
};

helpfulhints.removeHint = function(whichHint) {
  this.DOMbubble.classList.add('hide');
  this.DOMbubble.classList.remove('animated');
};

helpfulhints.initiateSubscribe = function() {
  this.store.subscribe(() => {
    //console.log(this.store.getState().game.noOfCardsDiscarded);
    if (this.store.getState().game.noOfCardsDiscarded === 1) {
      helpfulhints.removeHint();
    }
    if (this.store.getState().game.noOfCardsDiscarded === 2) {
      helpfulhints.showHint(2);
    }
    if (this.store.getState().game.noOfCardsDiscarded === 3) {
      helpfulhints.removeHint();
    }
  });
};

export default helpfulhints;
