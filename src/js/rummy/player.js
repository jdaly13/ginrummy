import { rummy } from './index';
import helpfulhints from './helpfulhints';

const player = Object.create(rummy);

player.takeFromDeck = function(e) {
  e.target.disabled = true;
  e.target.nextElementSibling.disabled = false;
  const topFromDeck = this.DOMdeck.lastElementChild;
  console.log(topFromDeck);

  topFromDeck.classList.add('player', 'temp', 'speedUpAnimation');
  topFromDeck.style.transform = 'translate(-50px, 230px)';
  topFromDeck.addEventListener('transitionend', event => {
    this.flipcards('top-card', topFromDeck);
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
  ele.addEventListener('transitionend', e => {
    ele.removeAttribute('style');
    ele.classList.remove('temp', 'speedUpAnimation');
    ele.classList.add('delt');
    this.DOMplayerArea.prepend(ele);
  });
};

player.takeFromPile = function(e) {
  if (e.target.className.contains('take')) {
  }
};

player.playerKnock = function() {};

player.userEvents = function() {
  this.DOMtakeCardButton.addEventListener(
    'click',
    this.takeFromDeck.bind(this)
  );
  this.DOMreshuffleButton.addEventListener(
    'click',
    this.takeFromPile.bind(this)
  );
  this.DOMknockButton.addEventListener('click', this.playerKnock.bind(this));
};

export { player };
