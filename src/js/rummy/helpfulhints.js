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
  }
};

helpfulhints.removeHint = function(whichHint) {
  this.DOMbubble.classList.add('hide');
};

export default helpfulhints;
