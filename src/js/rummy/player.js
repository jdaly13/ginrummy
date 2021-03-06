import { rummy } from './index';
import { discard } from '../constants';
import { playerDiscard, playerKnock } from '../actions';
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
      this.toggleDiscardState('takeFromDeck');
      i = true;
    }
  });
};
//clean fix this up
player.takeFromPile = function(e) {
  if (e.target.classList.contains('take')) {
    this.togglebutton(this.DOMtakeCardButton);
    let i = false,
      position = 0,
      card = e.target.parentElement.parentElement;
    e.target.classList.remove('take');
    e.target.textContent = discard;
    e.target.parentElement.classList.remove('taketopCard');
    position = getOffset(card).left - getOffset(this.DOMplayer).left;
    card.classList.add('player', 'speedUpAnimation');
    card.style.transform = 'translate(' + -position + 'px, 198px)';

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
        this.toggleDiscardState('takeFromPile');
        // dispatch event
        i = true;
      }
    });
  }
};

player.toggleDiscardState = function(which) {
  Array.from(this.DOMplayerArea.querySelectorAll('.wrapper')).forEach(
    (ele, i) => {
      ele.querySelector('a').classList.toggle('show');
    }
  );
  if (which === 'takeFromDeck') {
    this.DOMJunkPileContainer.lastElementChild.firstElementChild.classList.remove(
      'taketopCard'
    );
  }
  this.DOMtakeCardButton.setAttribute('disabled', true);
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
  //console.log(this.store.getState().game.playerKnock)
  if(this.store.getState().game.playerKnock) { //see if player knocked
    const legitmateKnock = this.decideWhichCard(this.DOMplayer.querySelectorAll('.wrapper'), 'firstPlayerKnock');  // do they have enough to knock
    if(legitmateKnock === 'legitimate') { //enough to knock
      this.decideWhichCard(this.DOMcomp_playerArea.querySelectorAll('.wrapper'), 'getJoshuaScore'); //get computer score
    } else if (legitmateKnock === 'not-legitimate') { //enough to knock 
      window.alert("you don't have enough to knock");
      this.store.dispatch(playerKnock()) //player knock if false now
      this.store.dispatch(playerDiscard());
    }
  } else {
    this.store.dispatch(playerDiscard());
  }

};

player.playerKnock = function (e) {
  window.alert('please choose one last card to discard');
  e.target.disabled = true;
  this.store.dispatch(playerKnock()) //player knock is true
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
  this.DOMknockButton.addEventListener('click', this.playerKnock.bind(this));
  this.DOMplayerArea.addEventListener('click', e => {
    if (e.target.classList.contains('show')) {
      this.preDiscardCard(e);
    }
  });
};
export { player };
