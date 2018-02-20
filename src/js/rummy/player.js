import { rummy } from './index';
import helpfulhints from './helpfulhints';

const player = Object.create(rummy);

player.takeFromDeck = function(e) {
  let i = false;
  e.target.disabled = true;
  e.target.nextElementSibling.disabled = false;
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

  //var $topFromDeck = $deck.find('.delt:first').prev() || $deck.find(':last-child').prev();
  /* $topFromDeck.addClass('player temp speedUpAnimation').css({
        '-webkit-transform': 'translateX(-50px)',
        'transform': 'translateX(-50px)'
    })
        .removeStyle('top')
        .one(transitionEndEvent, function () {
            that.flipCards('new_card', $(this));
            if (flag) removeHelpfulHints();
            flag = false;
        });
        var $takebutton = $deck.children(':last-child').find('div').children('a.take');
        $takebutton.hide();
        */
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

player.takeFromPile = function(e) {
  if (e.target.className.contains('take')) {
  }
};

player.toggleDiscardState = function() {
  Array.from(this.DOMplayerArea.querySelectorAll('.wrapper')).forEach(
    (ele, i) => {
      ele.querySelector('a').classList.toggle('show');
    }
  );
};

player.discardCard = function(e, increment) {
  if (e.target.classList.contains('show')) {
    const card = e.target.parentElement.parentElement;
    this.toggleDiscardState();
    this.discard(card, increment);
    e.preventDefault();
  }
};

player.userEvents = function(junkpilemargin) {
  let increment = 0;
  this.DOMtakeCardButton.addEventListener(
    'click',
    this.takeFromDeck.bind(this)
  );
  this.DOMreshuffleButton.addEventListener(
    'click',
    this.takeFromPile.bind(this)
  );
  //this.DOMknockButton.addEventListener('click', this.playerKnock.bind(this));
  this.DOMplayerArea.addEventListener('click', e => {
    if (e.target.classList.contains('show')) {
      increment += junkpilemargin;
      this.discardCard(e, increment);
    }
  });
};

export { player };
