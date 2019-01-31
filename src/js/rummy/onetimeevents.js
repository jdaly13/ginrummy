import { rummy } from './index';
import { discard, translateX } from '../constants';
import { shuffle } from '../utils';
import { flipNewDeck, reshuffle, dealCards, createDeck } from '../actions';
import helpfulhints from './helpfulhints';

const Sortable = require('sortablejs');
const oneTimeEvents = Object.create(rummy);
oneTimeEvents.createarrayofcards = function(callcreatehtmldeck) {
  var second_key = '',
    suit_object = '',
    arr = [],
    key;
  for (key in this.deckofcards) {
    // we use for in loop because it loops through prototype which we want
    suit_object = this.deckofcards[key]; // {hearts, diamonds, clubs, spades }
    var suit = suit_object;
    for (second_key in suit) {
      //second_key is ace, two, three, etc
      arr.push(second_key + ' of ' + key + ' ' + suit[second_key]); //e.g ace of hearts 1
    }
  }
  this.whole_deck = shuffle(arr); //shuffling the deck
  if (callcreatehtmldeck) {
    this.fillinmaincontent();
    this.loopthroughdiv();
    this.dealcards();
  }
};
oneTimeEvents.fillinmaincontent = function() {
  this.DOMdeck.innerHTML = this.createhtmlDeck(this.whole_deck);
  this.store.dispatch(createDeck('deckCreated'));
};

oneTimeEvents.createhtmlDeck = function(wholeDeck) {
  var wholedecklength = wholeDeck.length,
    i,
    html = '',
    suit;
  for (i = 0; i < wholedecklength; i++) {
    suit = this.whole_deck[i].split(' ')[2];
    html +=
      '<section class="wrapper"><div data-side="front" class=' +
      suit +
      '>' +
      wholeDeck[i] +
      '</div><div class="back"></div></section>';
  }
  return html;
};
oneTimeEvents.loopthroughdiv = function() {
  var html_text;
  var html_text_num;
  var space;
  var last;
  Array.from(this.DOMdeck.querySelectorAll('[data-side="front"]')).forEach(
    (ele, index) => {
      html_text = ele.innerText;
      html_text_num = html_text.substr(html_text.length - 2);
      space = html_text.split(' ');
      ele.setAttribute('data-value', html_text_num.trim());
      ele.classList.add(space[0]);
      Object.assign(ele.parentElement.style, {
        transform: 'translate(' + (1 + index) + 'px,' + (1 + index) + 'px)',
        zIndex: 1 + index
      });
      last = space.pop();
      ele.innerHTML =
        '<p>' +
        space.join(' ') +
        "</p><a href='#'>" +
        discard +
        '</a><span>' +
        last +
        '</span>';
    }
  );
};



oneTimeEvents.dealcards = function(e) {
  var k = 50;
  var i = 51;
  var delay = 0.1;
  var numberOfTotalCardsdelt = 20;
  var whenToStop = i - numberOfTotalCardsdelt; //31
  var delayString;
  var wrappers = this.DOMdeck.querySelectorAll('.wrapper');
  helpfulhints.removeHint();
  if (e && e.target) {
    e.target.setAttribute('disabled', 'disabled');
  }

  wrappers[whenToStop + 1].addEventListener(
    'transitionend',
    () => {
      this.store.dispatch(dealCards('cardsDelt'));
      this.flipNewDeck();
    },
    { once: true }
  );
  for (i; i > whenToStop; i--) {
    if (i % 2 === 1) {
      //player
      wrappers[i].classList.add('player', 'delt');
      delayString = delay.toString() + 's';
      Object.assign(wrappers[i].style, {
        transform: 'translate(' + (k - 50) + 'px,' + translateX + 'px)',
        'transition-delay': delayString
      });
    } else {
      //computer player
      wrappers[i].classList.add('comp_player', 'delt');
      Object.assign(wrappers[i].style, {
        transform: 'translate(' + (k - 50) + 'px, -200px)',
        'transition-delay': delayString
      });
      k = 100 + k;
    }

    delay = 0.25 + delay;
    if (i === whenToStop) {
      break;
    }
  }
};

oneTimeEvents.flipNewDeck = function() {
  var comp_player = this.DOMdeck.querySelectorAll('.comp_player'),
    first_player = this.DOMdeck.querySelectorAll('.player'),
    fp_pos = first_player[9].getBoundingClientRect(), //10 cards in deck
    cp_pos = comp_player[9].getBoundingClientRect(),
    fp_left = fp_pos.left,
    fp_top = fp_pos.top,
    cp_left = cp_pos.left,
    cp_top = cp_pos.top,
    zIndex = 50;
  this.DOMplayer.style.left = fp_left + 'px';
  this.DOMplayer.style.top = fp_top - translateX + 'px';
  this.DOMcomp_player.style.top = cp_top + 'px';
  this.DOMcomp_player.style.left = cp_left + 'px';

  Array.from(first_player).forEach((ele, index) => {
    ele.style.zIndex = zIndex - index;
    ele.classList.add('flipchild');
    first_player[9].addEventListener(
      'transitionend',
      e => {
        ele.removeAttribute('style');
        this.DOMplayer.style.top = fp_top + 'px';
        this.DOMplayerArea.prepend(ele);
        this.store.dispatch(flipNewDeck('flippedDeck'));
        this.makeDeckSortable();
      },
      { once: true }
    );
    
  }); 

  Array.from(comp_player).forEach((ele, i) => {
    ele.removeAttribute('style');
    this.DOMcomp_playerArea.append(ele);
  });
};

oneTimeEvents.makeDeckSortable = function() {
  rummy.sortable = Sortable.create(this.DOMplayerArea, {
    draggable: '.wrapper',
    onAdd: function(e) {
      //console.log('add', e);
    },
    onRemove: function(e) {
      //console.log('remove', e);
    },
    onMove: function(e) {
      //console.log(e);
    }
  });
  rummy.DOMplayerArea = rummy.sortable.el;
  this.dealfirstcard();
};

oneTimeEvents.dealfirstcard = function() {
  const deckLastZChild = this.DOMdeck.lastElementChild;
  const firstChild = deckLastZChild.firstElementChild;
  const actionLink = deckLastZChild.querySelector('a');
  deckLastZChild.style.transform = 'translate( 190px, 32px)';
  deckLastZChild.classList.add('showdacard', 'junkpile');

  helpfulhints.showHint(1);

  deckLastZChild.addEventListener(
    'transitionend',
    e => {
      var copyofElement = deckLastZChild;
      copyofElement.classList.add('flipchild');
      copyofElement.addEventListener(
        'transitionend',
        event => {
          actionLink.textContent = 'TAKE';
          actionLink.classList.add('take');
          firstChild.classList.add('taketopCard');
          this.DOMtakeCardButton.classList.remove('hide');
          this.DOMknockButton.classList.remove('hide');
          this.DOMreshuffleButton.removeAttribute('disabled');
          //fix this and make it on flipcard transition end instead of showdacard animation
          //dispatch an event here
          e.target.removeAttribute('style');
          this.DOMJunkPileContainer.append(e.target);
        },
        { once: true }
      );
    },
    { once: true }
  );
};

oneTimeEvents.reshuffle = function() {
  this.DOMcomp_playerArea.innerHTML = '';
  this.DOMplayerArea.innerHTML = '';
  this.DOMcomp_playerArea.innerHTML = '';
  this.DOMJunkPileContainer.innerHTML = '';
  this.createarrayofcards(true);
  this.store.dispatch(reshuffle('reshuffled'));
};

oneTimeEvents.userEvents = function() {
  this.DOMdealCardsButton.addEventListener('click', this.dealcards.bind(this));
  this.DOMreshuffleButton.addEventListener('click', this.reshuffle.bind(this));
};
export { oneTimeEvents };
