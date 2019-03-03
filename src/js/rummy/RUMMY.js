import configureStore from '../store';
import { findFirstPlayerTotalValue, findJoshuaTotalValue, storeFinalJoshuaObject, playerDiscard, storeFinalFirstPlayerObject } from '../actions';
import {furtherFilter, sortObjOfArrays, decideWhichOnesToKeep, findMatches, doWeTakeTopCard, checkScore, shitPile, checkTheValueof, finalFilterFunc} from '../dataStructures';

const store = configureStore();
function RUMMY() {}
RUMMY.prototype = {
  store,
  /*
   #######################
   second paramter ACTION
    - falsy  //computer going through process to discard a particular card - may knock
    - dowetakediscardcard //Joshua decides which card top or discarded for next turn call func to see which card
    - firstPlayerKnock 
        A.first player knocks check to see if legitmate knock by calling function to see if score is good 10 or below - set player.knocked to false
    - getJoshuaScore 
        B.player has already knocked function is invoked to get Joshua score (start end of game)
    - getFirstPlayerScore
        C.computer has already knocked function is invoked to get First player score (start end of game)
    ######################
   */
  decideWhichCard(cardElements, action = null) {
    var array = [];
    Array.from(cardElements).forEach(ele => {
      array.push(ele.firstChild.getAttribute('class').split(' '));
    });
    return this.startTheProcess(array, action);
  },
  startTheProcess(arr, action) {
    var obj = furtherFilter(arr);
    var sortedObj = sortObjOfArrays(obj);
    var sortedObjects = decideWhichOnesToKeep(sortedObj);
    var objectsGalore = findMatches(sortedObjects, action); //fix why we pass in action
    let valueOfCardAndObjectsGaloreNew = [];
    let frontSideOfCardToBeDiscarded = false; //DOM object
    let finalFilterObj = {};
    let whatCardToRidThisTime = null;
    let total = 0;
    
    if (action === 'dowetakediscardcard') {
      return doWeTakeTopCard(this.DOMJunkPileContainer, objectsGalore);
    }
    total = checkScore(objectsGalore);
    console.log(total);

    /*
    player already initiated legitimate knock and we have saved first player score 
    just tallied computer score and we can end game
    */
    if (action === 'getJoshuaScore') { //joshua's cards st
      store.dispatch(findJoshuaTotalValue(total));
      this.beginningOfTheEnd(action, objectsGalore)
      return false;
    }
    //computer initiated legitimate knock and their score is already saved
    // get first Person player score and end game
    if (action === 'getFirstPlayerScore') { //first players cards
      store.dispatch(findFirstPlayerTotalValue(total));
      this.beginningOfTheEnd(action, objectsGalore);
      return false;
    }

    if (action === 'firstPlayerKnock') {// player initiated knock still need computer score
      if (total <= 10) {
        store.dispatch(findFirstPlayerTotalValue(total));
        store.dispatch(storeFinalFirstPlayerObject(objectsGalore));
        return 'legitimate'
      } else { //player doesn't have enought to knock
        return 'not-legitimate';
      }
    }
    console.log(objectsGalore);

    whatCardToRidThisTime = shitPile(
      objectsGalore.possibleDiscard,
      objectsGalore.maybes,
      objectsGalore.oneMatch
    );

    console.log(whatCardToRidThisTime);
    //return array first spot is either false or an array itself [[], newClonedObj]
    valueOfCardAndObjectsGaloreNew = checkTheValueof(whatCardToRidThisTime, objectsGalore);

    finalFilterObj = finalFilterFunc(
      valueOfCardAndObjectsGaloreNew[0] ? valueOfCardAndObjectsGaloreNew[0] : whatCardToRidThisTime,
      total,
      valueOfCardAndObjectsGaloreNew[1]
    );
    console.log(finalFilterObj);

    frontSideOfCardToBeDiscarded = this.findCardtoDiscard(
      finalFilterObj.stringToDiscard,
      valueOfCardAndObjectsGaloreNew[1].keepTheseOnes,
      typeof finalFilterObj.whatCardToRidThisTime === 'number'
        ? finalFilterObj.whatCardToRidThisTime
        : null
    );
    console.log(finalFilterObj.finalTotal);
    if (finalFilterObj.finalTotal <= 10) { //joshua knocks at this point but we still need to first first player score
      //dispatch event
      /*computerKnock = true;
      compPlayer.score = finalFilterObj.finalTotal;
      compPlayer.deck = objectsGalore;
      */
     store.dispatch(playerDiscard()); //does opposite setting it to false because it subscribes to store
     store.dispatch(storeFinalJoshuaObject(objectsGalore));
     store.dispatch(findJoshuaTotalValue(finalFilterObj.finalTotal));
     return {
      frontSideOfCardToBeDiscarded,
      computerKnock: true
     }
    }
    //joshua discards
    return frontSideOfCardToBeDiscarded;
  },
  togglebutton(target) {
    if (target) {
      target.disabled = true;
      target.nextElementSibling.disabled = false;
    } else {
      this.DOMtakeCardButton.disabled = false;
      this.DOMknockButton.disabled = true;
    }
  },

  findCardtoDiscard: function(eleClass, keepTheseObj, numb) {
    var checkKeepTheseOnes = function() {
      var classy = null;
      var keys = Object.keys(keepTheseObj);
      keys.forEach(function(val) {
        keepTheseObj[val].forEach(function(value) {
          if (value === numb) {
            classy = '.' + val;
          }
        });
      });

      return classy;
    };
    //console.log(eleClass, keepTheseObj, numb);
    if (this.DOMcomp_playerArea.querySelectorAll(eleClass).length > 1 && numb) {
      var extradite = checkKeepTheseOnes(keepTheseObj),
        ele;
      if (extradite) {
        ele = this.DOMcomp_playerArea.querySelector(
          'div:not(' + extradite + ')'
        );
      } else {
        ele = this.DOMcomp_playerArea.querySelector(eleClass);
      }
    } else {
      ele = this.DOMcomp_playerArea.querySelector(eleClass);
    }
    ele.classList.add('discard');
    return ele;
  },

  beginningOfTheEnd: function(playerOne, objectsGalore) {
      var finalScore = 0,
        firstplayerScore = this.store.getState().score.firstPlayerValue,
        computerScore = this.store.getState().score.joshuaValue,
        showCardObj = null,
        deadWoodArray = [],
        deadWoodMatch = null,
        whatToMinusInARow = [],
        whatToMinusMatch = [],
        whatToMinus = 0;
        console.log(playerOne, objectsGalore, firstplayerScore, computerScore );
      if (playerOne === 'getFirstPlayerScore') {
        //computer has knocked
        //firstplayerScore = true;
        finalScore = firstplayerScore - computerScore; 
        if (computerScore === 0) finalScore = finalScore + 20; //if computer scores gin rummy perfect hand
      } else { 
        //first player knocked
        //compPlayer.score = computerScore = total;
        //finalScore = computerScore - player.firstPersonScore;
        finalScore = computerScore - firstplayerScore;
        if (firstplayerScore === 0) finalScore = finalScore + 20;
      }
      showCardObj = this.showYourCardsJoshua(
        playerOne === 'getFirstPlayerScore' ? this.store.getState().score.joshuaFinalObj : objectsGalore
      );
      this.manipulateTheDom(showCardObj); // manipulate the DOM to show Joshua's cards
      
      deadWoodArray = this.laySomeDeadwood( //objectsGalore is always person who didn't knock
        playerOne === 'getFirstPlayerScore' ? true : false,
        objectsGalore
      );
      console.log(deadWoodArray);
      //take deadwood array and compare to player who knocked 
      //eg if joshua/computer knocks then use their object if not 
      //so opposite of objectsGalore
      deadWoodMatch = this.compareDeadwood(
        deadWoodArray,
        playerOne === 'getFirstPlayerScore' ? this.store.getState().score.joshuaFinalObj : this.store.getState().score.firstPlayerObj,
        playerOne === 'getFirstPlayerScore' ? 'joshua' : false
      );
      console.log(deadWoodMatch);

      if (deadWoodMatch) {
        if (deadWoodMatch.inaRow.length) {
          whatToMinusInARow = this.addOnYourDeadwoodToOpponet(
            deadWoodMatch.inaRow,
            'inarow',
            playerOne
          );
        }
        if (deadWoodMatch.match.length) {
          whatToMinusMatch = this.addOnYourDeadwoodToOpponet(
            deadWoodMatch.match,
            'match',
            playerOne
          );
        }
        whatToMinus = this.loopThroughWhatToMinus(
          whatToMinusInARow,
          whatToMinusMatch
        );
        finalScore = finalScore < 0 ? 0 - whatToMinus : finalScore - whatToMinus;
      }

      if (finalScore > 0) {
        this.makeLoveNotTupperWar(
          finalScore,
          playerOne,
          playerOne === 'getFirstPlayerScore' ? false : true
        );
      } else {
        this.makeLoveNotTupperWar(
          Math.abs(finalScore) + 10,
          playerOne,
          playerOne === 'getFirstPlayerScore' ? true : false
        );
      }
      return true;
  },

  showYourCardsJoshua: function(obj) {
    console.log(obj);
    // http://jsfiddle.net/fv6Ls7fg/1/ http://jsfiddle.net/fv6Ls7fg/2/
    var stackCardsBeforeDeadwood = function() {
      var children = this.DOMcomp_playerArea.children;
      Array.from(children).forEach((ele)=> {
        ele.removeAttribute('style');
      });
      this.DOMcomp_player.style.top = "15px";
    };


    stackCardsBeforeDeadwood.call(this);
    var prop;
    var matchArray = [];
    var keep = obj.keepTheseOnes;
    var moreThanOneMatch = obj.moreThanOneMatch;
    var object = {
      clubs: [],
      diamonds: [],
      hearts: [],
      spades: []
    };

    for (prop in keep) {
      for (var i = 0; i < keep[prop].length; i++) {
        object[prop][i] = '.' + prop + '.' + this.cardArray[keep[prop][i] - 1];
      }
    }

    for (var j = 0; j < moreThanOneMatch.length; j++) {
      matchArray.push('.' + this.cardArray[moreThanOneMatch[j] - 1]);
    }

    object.match = matchArray;
    console.log(object);

    return object;
  },

  manipulateTheDom: function(obj) {
    console.log(obj);
    var prop;
    var match = obj.match;
    var comp = this.DOMcomp_player;
    var $newDom = null;
    var pos = null;
    var totalLength = 0;
    var lastElementPos = this.DOMcomp_playerArea.lastElementChild.getBoundingClientRect().left;
    var doSomeDomManipulation = function(css_class, deadWood) {
      if (deadWood) {
        //deadWood.children().appendTo($newDom);
        Array.from(deadWood.children).forEach((ele)=>{
          $newDom.appendChild(ele);
        });

        return true;
      }
         //fix
        comp.querySelectorAll(css_class).forEach((ele) => {
          var sectionParent = ele.parentElement;
          if (!sectionParent.classList.contains('tagged')){
            sectionParent.classList.add('tagged');
            $newDom.appendChild(sectionParent);
          }
        });
    };

    var figureOutChildrenAndPlacement = function(len, $newDom) {
      //len is not used
      var compchildrenLength = comp.children.length;
      var newDomChildrenLength = $newDom.children.length;
      totalLength += newDomChildrenLength;
      var width = newDomChildrenLength * 85;
     // $newDom.css('width', width); //85 children width
     console.log(totalLength, lastElementPos )
      $newDom.style.width = width + 'px';
      if (compchildrenLength == 1) {
        pos = parseInt(lastElementPos) - width;
        $newDom.style.left = pos + 'px';
        //$newDom.css('left', pos + 'px');
      }

      if (compchildrenLength == 2) {
        console.log(pos, $newDom.getBoundingClientRect().width )
        //var last = pos - (totalLength - 1) * 85;
        var last = pos - (5 * 85);//temp fix hardcoding 5
        //$newDom.css('left', last + 'px');
        $newDom.style.left = last + 'px';
      }

      if (compchildrenLength == 3) {
        if (totalLength === 10) {
          //$newDom.css('left', '100px');
          $newDom.style.left = '0px'; //no deadwood 
        } else {
          $newDom.style.left = '100px';
          //$newDom.css('left', '50px');
        }
      }
      //$newDom.appendTo(comp);
      comp.appendChild($newDom);
    };

    var createSection = function(property) {
     //return $("<section class=' " + classy + " '></section>");
      var section = document.createElement('section');
      section.classList.add(property, 'runs_wrapper');
      return section;
    };

    var whatToDoWithTheRest = function(compArea) {
      //var $children = $compArea.children();
      //var compareaChildrenLength = $children.length;
      console.log('whattodowiththerestcalled')
      var compareaChildrenLength = compArea.children.length;
      //var mostLeft = parseInt($comp.children().last().css('left'));
      $newDom = createSection('leftovers');
      doSomeDomManipulation.call(this, '.wrapper', compArea);
      //$newDom.css({ left: '-85px', width: compareaChildrenLength * 85 + 'px' });
      $newDom.style.left = '0px';
      $newDom.style.width = compareaChildrenLength * 85 + 'px';
      comp.appendChild($newDom);
      //$newDom.appendTo(comp);
     // $compArea.remove(); /* IMPORTANT */
      compArea.parentElement.removeChild(compArea);
    };
    for (prop in obj) {
      if (prop !== 'match' && obj[prop].length) {
        $newDom = createSection(prop);
        for (var i = 0; i < obj[prop].length; i++) {
          doSomeDomManipulation.call(this, obj[prop][i]);
        }
        figureOutChildrenAndPlacement.call(this, obj[prop].length, $newDom);
      }
    }

    for (var j = 0; j < match.length; j++) {
      var property = 'match' + j;
      $newDom = createSection(property);
      doSomeDomManipulation.call(this, match[j]);
      figureOutChildrenAndPlacement.call(this, null, $newDom);
    }

    //whatToDoWithTheRest(this.$comp_area);
    whatToDoWithTheRest(this.DOMcomp_playerArea);
    //what do we do with deadwood?
  },

  laySomeDeadwood: function(joshuKnocked, notKnocker) {
    var area = null;
    var deadWooodCardsArray = [];
    var that = this;
    var findOneMatch = function(whatToFind) {
      for (var i = 0; i < whatToFind.length; i++) {
        for (var j = 0; j < 2; j++) {
          // 2 is a match
          var numberToLetters = '.' + that.cardArray[whatToFind[i] - 1];
          var watToPush = area.querySelectorAll(numberToLetters)[j].getAttribute('class').split(' ')[0] + whatToFind[i];
          deadWooodCardsArray.push(watToPush);
        }
      }
    };

    var findMaybesOrPossibleDiscards = function(whatToFind) {
      for (var prop in whatToFind)
        for (var i = 0; i < whatToFind[prop].length; i++) {
          deadWooodCardsArray.push(prop + ' ' + whatToFind[prop][i]);
        }
    };

    var giveFirstPlayerHints = function(obj) {
      var oneMatch = obj.oneMatch; //returns array [5]
      var maybes = obj.maybes;
      var possibleDiscard = obj.possibleDiscard;
      findOneMatch(oneMatch);
      findMaybesOrPossibleDiscards(maybes);
      findMaybesOrPossibleDiscards(possibleDiscard);
      return deadWooodCardsArray;
    };

    if (joshuKnocked) {
      area = this.DOMplayerArea;
    } else {
      //$area = $('.leftovers');
      area = document.querySelector('.leftovers'); // what if computer has rummy after you knocked - fat chance but it could happen!
    }

    return giveFirstPlayerHints(notKnocker);
  },

  compareDeadwood: function(deadwood, deck, joshua) {
    var moreThanOneMatch = deck.moreThanOneMatch;
    var inARow = deck.keepTheseOnes;
    var deadlength = deadwood.length;
    var matches = false;

    // make utility function
    var extractNumber = function(deadString) {
      return parseInt(deadString.match(/\d+/));
    };

    // make utility function
    var extractString = function(strWithNum) {
      var strIndex = strWithNum.indexOf(' ');
      return strWithNum.slice(0, strIndex);
    };

    var canWeAddToExistingMatch = function() {
      var arr = [];
      var compareIt = function(number) {
        for (var j = 0; j < moreThanOneMatch.length; j++) {
          if (number === moreThanOneMatch[j]) {
            return moreThanOneMatch[j];
          }
        }
        return false;
      };
      for (var i = 0; i < deadlength; i++) {
        var it = extractNumber(deadwood[i]);
        var existingMatch = compareIt(it);
        if (existingMatch) {
          arr.push(deadwood[i]);
          deadwood[i] = '';
        }
      }

      if (arr.length) {
        return arr;
      } else {
        return false;
      }
    };

    var canWeAddtoKeepTheseOnes = function() {
      var arr = [];
      var valueOrFalse = null;
      var comparison = function(prop, numb) {
        for (var j = 0; j < deadlength; j++) {
          var sliceString = extractString(deadwood[j]);
          var getNum = extractNumber(deadwood[j]);
          if (sliceString == prop) {
            if (getNum == numb - 1 || getNum == numb + 1) return deadwood[j];
          }
        }
        return false;
      };

      for (var prop in inARow) {
        for (var i = 0; i < inARow[prop].length; i++) {
          valueOrFalse = comparison(prop, inARow[prop][i]);
          if (!!valueOrFalse) arr.push(valueOrFalse);
        }
      }

      if (arr.length) {
        return arr;
      } else {
        return false;
      }
    };

    var addToExistingMatch = canWeAddToExistingMatch();
    var addOnToInARow = canWeAddtoKeepTheseOnes();
    if ((addToExistingMatch && !!joshua) || (addOnToInARow && !!joshua)) {
      matches = true;
      //do some dom manipulation give user hin by animating card or something if they click then deduct points off score
    }

    if ((addToExistingMatch && !joshua) || (addOnToInARow && !joshua)) {
      // player knocked first
      matches = true;
      console.log(addToExistingMatch); //fix this
      // no hints needed just do some animation and have joshua slide his card over to main deck maybe
    }

    if (!!matches) {
      return {
        johsua: joshua,
        match: addToExistingMatch || [],
        inaRow: addOnToInARow || []
      };
    } else {
      return matches; // false
    }
  },

  addOnYourDeadwoodToOpponet: function(arr, str, player) {
    var that = this;
    var num = null;
    var numArray = [];
    var leftovers = document.querySelector('.leftovers');
    var extractNumber = function(deadString) {
      return parseInt(deadString.match(/\d+/));
    };
    var extractString = function(strWithNum) {
      var strIndex = strWithNum.indexOf(' ');
      return strWithNum.slice(0, strIndex);
    };
    if (str == 'match') {
      arr.forEach(function(val) {
        num = extractNumber(val);
        var string = that.cardArray[num - 1];
        if (player === 'getFirstPlayerScore') {
            that.DOMplayerArea.querySelector('.'+string).parentElement.classList.add('zooom');
        } else {
           leftovers.querySelector('.'+string).parentElement.classList.add('zooom');
        }
        numArray.push(num);
      });
      return numArray;
    } else {
      arr.forEach(function(val) {
        num = extractNumber(val);
        var numString = '.' + that.cardArray[num - 1];
        var suit = '.' + extractString(val);
        var together = suit + numString;
        if (player === 'getFirstPlayerScore') {
          /*that.$area
            .find(together)
            .parent()
            .addClass('zooom');
            */
           that.DOMplayerArea.querySelector(together).parentElement.classList.add('zooom');
        } else {
          /*$('section.leftovers')
            .eq(0)
            .find(together)
            .parent()
            .addClass('zooom');
            */
           leftovers.querySelector(together).parentElement.classList.add('zooom');
        }

        numArray.push(num);
      });

      return numArray;
    }
  },

  makeLoveNotTupperWar: function(score, string, win) {
    var obj = {};
    obj.heading = win
      ? 'Congratulations You Won this hand '
      : 'Sorry you lost this hand';
    obj.win = win ? 'You' : 'Joshua';
    obj.text =
      string === 'getFirstPlayerScore'
        ? obj.win + ' scored ' + score + ' points'
        : obj.win + ' scored ' + score + ' points';
    obj.score = score;
    obj.total = this.getExistingWinnerTotal(obj.win) + obj.score;
    console.log('calledmakeloveNotupper');
    this.overlay(obj);
  },

  getExistingWinnerTotal: function(winner) {
    if (window.localStorage[winner]) {
      var values = window.localStorage[winner].split(',');
      var total = 0;
      values.forEach(function(val) {
        total += parseInt(val);
      });
      return total;
    }
    return 0;
  },

  loopThroughWhatToMinus: function(arr1, arr2) {
    var array = arr1.concat(arr2);
    var numToReturn = 0;
    array.forEach(function(val) {
      var value = val > 10 ? 10 : val;
      numToReturn += value;
    });

    return numToReturn;
  },


  overlay: function(howsitgonnabe) {
    var overlay = document.querySelector('.overlay'),
      closeBttn = overlay.querySelector('.overlay-close'),
      that = this,
      game_over = document.getElementById('game_over'),
      score = howsitgonnabe ? howsitgonnabe.score : null,
      endOfMatch = false,
      startNewGame = function() {
        var trigger = document.getElementById('trigger-overlay');
        trigger.innerHTML = '';
        trigger.classList.add('newGAME', 'bubble');
        trigger.innerText = 'Start New Match';
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.reload(); //FIX THIS
        });
      },
      toggleOverlay = function(e={}) {
        if (e.target) { e.preventDefault()}

        if (overlay.classList.contains('open')) {
          overlay.classList.remove('open');
          overlay.classList.add('close');
          var onEndTransitionFn = function() {
            overlay.classList.remove('close');
          };
          overlay.addEventListener('transitionend', onEndTransitionFn, {
            once: true
          });
          game_over.style.display = "none";
          closeBttn.removeEventListener('click', middleman, false);
        } else if (!overlay.classList.contains('close')) {
          overlay.classList.add('open');
          closeBttn.addEventListener('click', middleman, false);
            if (e.heading && e.total < 100) {
              game_over.style.display = "block"; //FIX THIS 
              document.getElementById('intro').style.display = "none"
              game_over.querySelector('h1').innerHTML = howsitgonnabe.heading;
              game_over.querySelector('h2').innerHTML = howsitgonnabe.text;
            }

            if (e.heading && e.total >= 100) {
              endOfMatch = true;
              game_over.style.display = "block"; //FIX THIS 
              if (howsitgonnabe.win === 'You') {
                game_over.querySelector('h1').innerHTML =
                  "Congratualations You won the game but I'll get you next time, Gadget! NEXT time!";
                game_over.querySelector('h2').innerHTML =
                  'You scored a total of ' + howsitgonnabe.total + ' points';
                that.congratulations(true);
              } else {
                //joshua won
                game_over.querySelector('h1').innerHTML =
                  "Joshua and O'Doyle Rules!!! - GAME OVER!";
                game_over.querySelector('h2').innerHTML =
                  'Joshua scored a total of ' + howsitgonnabe.total + ' points';
                that.congratulations();
              }
              return true;
            }
        } else {
          overlay.classList.add('open');
        }

        if (e.data && e.data.score) {
            //END OF Match
            [].slice
              .call(document.querySelectorAll('button'))
              .forEach(function(obj) {
                if (obj.classList.contains('overlay-close')) {
                  obj.disabled = false;
                } else {
                  obj.disabled = true;
                }
              });
            that.updateScore(howsitgonnabe); //FIX this
            startNewGame();
        }

      },
      middleman = function (e) {
        e.data = {};
        e.data.score = endOfMatch ? false : score;
        toggleOverlay(e);
      };

    if (howsitgonnabe) {
      var endOfGame = toggleOverlay(howsitgonnabe);
      if (endOfGame) return true;
    }

    if (window.localStorage.getItem('modal') !== 'falsy' && !howsitgonnabe) {
      overlay.appendChild(this.DOMIntroNIframe);
      this.DOMIntroNIframe.classList.remove('hide');
      toggleOverlay();
      window.localStorage.setItem('modal', 'falsy');
    }
  },

  congratulations: function(player) {
    console.log('player', player);
    if (player) {
      //do some celebration animation TODO
    } else {
      // do something else
    }

    window.localStorage.removeItem('You');
    window.localStorage.removeItem('Joshua');
  },

  /* CALLLED ON PAGE OPEN TO DO FIX */
  updateScore: function(obj) {
    var whoWon = obj.win;
    var whoLost = obj.win === 'You' ? 'Joshua' : 'You';
    var you = document.getElementById('you');
    var joshua = document.getElementById('joshua');
    var yourChildren = you.querySelector('div').children;
    var joshuaChildren = joshua.querySelector('div').children;
    var span = document.createElement('span');
    var winnerObj = {};
    var loserObj = {};
    var overHundred = false;
    console.log(obj);

    var updateSpan = function() {
      span.innerHTML = obj.score;
    };

    var loopThroughSpans = function(spans) {
      var arr = [];
      var total = 0;
      for (var i = 0; i < spans.length; i++) {
        var num = parseInt(spans[i].textContent);
        arr.push(num);
        total += num;
      }
      overHundred = total >= 100 ? true : false;
      return {
        arr: arr,
        total: total,
        overOneHundred: overHundred
      };
    };
    if (whoWon === 'You') {
      // refactor this
      updateSpan();
      you.querySelector('div').appendChild(span);
      winnerObj = loopThroughSpans(yourChildren);
      loserObj = loopThroughSpans(joshuaChildren);
      you.querySelector('h6').innerHTML = winnerObj.total;
    } else {
      //duh computer
      updateSpan();
      joshua.querySelector('div').appendChild(span);
      winnerObj = loopThroughSpans(joshuaChildren);
      loserObj = loopThroughSpans(yourChildren);
      joshua.querySelector('h6').innerHTML = winnerObj.total;
    }

    if (winnerObj.overOneHundred) {
      /*$('#score')
        .nextUntil('div.overlay')
        .remove();*/
        this.DOMcomp_player.parentElement.removeChild(this.DOMcomp_player);
        this.DOMplayer.parentElement.removeChild(this.DOMplayer);
        document.getElementById('main_content').parentElement.removeChild(document.getElementById('main_content'));
    }

    window.localStorage.setItem(whoWon, winnerObj.arr);
    window.localStorage.setItem(whoLost, loserObj.arr);
    document.getElementById('score').style.display = 'block';
  },

  checkLocalStorage: function() {
    var createSpans = function(arr, id) {
      var total = 0;
      arr.forEach(function(val, i, array) {
        var span = document.createElement('span');
        span.innerHTML = val;
        id.querySelector('div').appendChild(span);
        total += parseInt(val);
      });
      id.querySelector('h6').innerHTML = total;
      if (total >= 100) {
        window.localStorage.clear();
      }
    };
    if (
      window.localStorage.getItem('You') ||
      window.localStorage.getItem('Joshua')
    ) {
      document.getElementById('score').style.display = 'block';
      if (window.localStorage.getItem('You')) {
        var you = window.localStorage.getItem('You').split(',');
        createSpans(you, document.getElementById('you'));
        //loop through  you and crate spans for each one append to you div
      }
      if (window.localStorage.getItem('Joshua')) {
        var joshua = window.localStorage.getItem('Joshua').split(',');
        createSpans(joshua, document.getElementById('joshua'));
      }
    }
  }
  
};
export default RUMMY;
