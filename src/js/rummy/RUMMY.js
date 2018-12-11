import configureStore from '../store';
import { findFirstPlayerTotalValue, findJoshuaTotalValue, storeFinalJoshuaObject, storeFinalFirstPlayerObject } from '../actions';
import {cloneObjectOfArrays} from '../utils';

const store = configureStore();
function RUMMY() {}
RUMMY.prototype = {
  store,
  /***********
   second paramter ACTION
    - falsy  //computer going through process to discard a particular card - may knock
    - dowetakediscardcard //Joshua decides which card top or discarded for next turn call func to see which card
    - firstPlayerKnock 
        A.first player knocks check to see if legitmate knock by calling function to see if score is good 10 or below - set player.knocked to false
    - getJoshuaScore 
        B.player has already knocked function is invoked to get Joshua score (start end of game)
    - getFirstPlayerScore
        C.computer has already knocked function is invoked to get First player score (start end of game)
  
   */
  decideWhichCard(cardElements, action = null) {
    var array = [];
    Array.from(cardElements).forEach(ele => {
      array.push(ele.firstChild.getAttribute('class').split(' '));
    });
    return this.startTheProcess(array, action);
  },
  startTheProcess(arr, action) {
    var obj = this.furtherFilter(arr);
    var sortedObj = this.sortObjOfArrays(obj);
    var sortedObjects = this.decideWhichOnesToKeep(sortedObj);
    var objectsGalore = this.findMatches(sortedObjects, action); //fix why we pass in action
    let valueOfCardAndObjectsGaloreNew = [];
    let frontSideOfCardToBeDiscarded = false; //DOM object
    let finalFilterObj = {};
    let whatCardToRidThisTime = null;
    let total = 0;
 
    if (action === 'dowetakediscardcard') {
      return this.doWeTakeTopCard(this.DOMJunkPileContainer, objectsGalore);
    }
    total = this.checkScore(objectsGalore);
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

    whatCardToRidThisTime = this.shitPile(
      objectsGalore.possibleDiscard,
      objectsGalore.maybes,
      objectsGalore.oneMatch
    );
    //return array first spot is either false or an array itself [[], newClonedObj]
    valueOfCardAndObjectsGaloreNew = this.checkTheValueof(whatCardToRidThisTime, objectsGalore);

    finalFilterObj = this.finalFilter(
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
  finalFilter(whatCardToRidThisTime, total, objectsGalore) {
    let finalTotal = 0;
    let stringToDiscard = '';
    if (typeof whatCardToRidThisTime === 'number') {
      finalTotal = total - whatCardToRidThisTime;
      stringToDiscard = '.' + this.cardArray[whatCardToRidThisTime - 1];
    } else {
      if (whatCardToRidThisTime === 'wtf') {
        whatCardToRidThisTime = this.findAnything(objectsGalore);
      }
      finalTotal =
        total - (whatCardToRidThisTime[1] > 10 ? 10 : whatCardToRidThisTime[1]);
      whatCardToRidThisTime[1] =
        '.' + this.cardArray[whatCardToRidThisTime[1] - 1];
      stringToDiscard = whatCardToRidThisTime.join(''); //hopefully fixed - should produce .clubs.ten
    }
    return {
      finalTotal,
      stringToDiscard,
      whatCardToRidThisTime
    };
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
  furtherFilter(arr) {
    const obj = {};
    arr.forEach(value => {
      if (!obj[value[0]]) {
        obj[value[0]] = [];
      }
      obj[value[0]].push(this.cardValues[value[1]]);
    });
    return obj;
  },
  sortObjOfArrays: function(object) {
    var copy = cloneObjectOfArrays(object);
    this.cardSuits.forEach(value => {
      if (!object[value]) {
        copy[value] = [];
      } 
      copy[value].sort((a, b) => {
        return a - b;
      });
    });
    return copy;
  },
  decideWhichOnesToKeep: function(obj) {
    //http://jsfiddle.net/9joukzhv/1/ - http://jsfiddle.net/9joukzhv/2/
    var keepTheseOnes = {};
    var maybes = {};
    var possibleDiscard = {};
    var keys = Object.keys(obj);
    var arrr = [];

    var checkToSeeIfItsInArray = function(prev, val, next) {
      var prevInArray = false;
      var valInArray = false;
      var nextInArray = false;
      arrr.forEach(function(value) {
        if (value == prev) prevInArray = true;
        if (value == val) valInArray = true;
        if (value == next) nextInArray = true;
      });

      if (!prevInArray) arrr.push(prev);
      if (!valInArray) arrr.push(val);
      if (!nextInArray) arrr.push(next);
    };

    var getDifference = function(arr1, arr2) {
      var ret = [];
      arr1.forEach(function(value) {
        if (arr2.indexOf(value) == -1) {
          ret.push(value);
        }
      });
      return ret;
    };

    keys.forEach(function(value) {
      keepTheseOnes[value] = keepTheseOnes[value] || [];
      possibleDiscard[value] = possibleDiscard[value] || [];
      maybes[value] = maybes[value] || [];
      if (obj[value].length) {
        if (obj[value].length == 1) possibleDiscard[value].push(obj[value][0]);
        obj[value].reduce(function(prevValue, current, index, arr) {
          if (current - prevValue == 1 || current + 1 == arr[index + 1]) {
            if (arr[0] + 1 == arr[1] && arr[0] == prevValue) {
              keepTheseOnes[value].push(prevValue, current);
            } else {
              if (arr[0] + 1 != arr[1] && index == 1) {
                possibleDiscard[value].push(arr[0]);
              }
              keepTheseOnes[value].push(current);
            }
          } else {
            if (index == 1) {
              possibleDiscard[value].push(prevValue, current);
            } else {
              possibleDiscard[value].push(current);
            }
          }
          return arr[index];
        });
      }

      keepTheseOnes[value].forEach(function(value, i, arr) {
        if (value - 1 === arr[i - 1] && value + 1 == arr[i + 1]) {
          checkToSeeIfItsInArray(value - 1, value, value + 1);
        }
      });

      maybes[value] = getDifference(keepTheseOnes[value], arrr);
      keepTheseOnes[value] = arrr;
      arrr = [];
    });

    return {
      keepTheseOnes: keepTheseOnes,
      maybes: maybes,
      possibleDiscard: possibleDiscard
    };
  },
  findMatches: function(objOfObjects, playa) {
    //SOLUTION http://jsfiddle.net/25nh54dp/34/ // http://jsfiddle.net/25nh54dp/37/ line ~516 -- FIX THIS http://jsfiddle.net/25nh54dp/38/(screenshot)
    //http://jsfiddle.net/25nh54dp/40/
const clonedObjectofObjects = cloneObjectOfArrays(objOfObjects);
    var properties = this.cardSuits;
    var testArray = [];
    var keepArray = [];
    var sortDiscard = false;
    var keysOfObjects = Object.keys(clonedObjectofObjects);
    var multipleHandsOneSuit = function(arr, suit) {
      if (arr.length > 7) return false;
      arr.some(function(value, index, array) {
        if (value + 1 !== array[index + 1]) {
          keepArray.push(
            array[0],
            value,
            array[index + 1],
            array[array.length - 1]
          );
          keepArray.multiple = suit || false;
          return keepArray;
        }
      });
    };
    keepArray.multiple = false;

    keysOfObjects.forEach(function(value, i, arr) {
      if (value === 'keepTheseOnes') {
        properties.forEach(function(val, index, array) {
          var first, last, middle;
          if (clonedObjectofObjects[value][val].length >= 3) {
            if (
              clonedObjectofObjects[value][val][clonedObjectofObjects[value][val].length - 1] -
                clonedObjectofObjects[value][val][0] !==
              clonedObjectofObjects[value][val].length - 1
            ) {
              multipleHandsOneSuit(clonedObjectofObjects[value][val], val);
            } else {
              first = clonedObjectofObjects[value][val][0];
              last =
                clonedObjectofObjects[value][val][clonedObjectofObjects[value][val].length - 1];
              if (clonedObjectofObjects[value][val].length === 3) {
                middle = clonedObjectofObjects[value][val][1];
                keepArray.push(first, middle, last);
              } else {
                keepArray.push(first, last);
              }
            }
          }
        });
      } else {
        properties.forEach(function(val, index, arrary) {
          clonedObjectofObjects[value][val].forEach(function(v, ind, ar) {
            testArray.push(v);
          });
        });
      }
    });

    testArray.sort(function(a, b) {
      return a - b;
    });

    clonedObjectofObjects.oneMatch = [];
    clonedObjectofObjects.moreThanOneMatch = [];

    function findDupes(arr) {
      var counts = {};
      var matches = false;
      for (var i = 0; i < arr.length; i++) {
        var num = arr[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }

      for (var prop in counts) {
        if (counts[prop] == 1) {
          delete counts[prop];
        }

        if (counts[prop] == 2) {
          clonedObjectofObjects.oneMatch.push(parseInt(prop));
          matches = true;
        }

        if (counts[prop] > 2) {
          clonedObjectofObjects.moreThanOneMatch.push(parseInt(prop));
          matches = true;
        }
      }
      return matches;
    }
    var matches = findDupes(testArray);

    if (!!matches) {
      var keepArrayMatches = compareWithkeepArray();
      removeFromDiscard(
        clonedObjectofObjects.oneMatch,
        clonedObjectofObjects.moreThanOneMatch,
        keepArrayMatches
      );
      goThroughKeepTheseOnesAgain();
      if (!!sortDiscard) sortDiscardPile();
      return clonedObjectofObjects;
    } else {
      return clonedObjectofObjects;
    }

    function removeFromDiscard(arr1, arry2) {
      var arr = arr1.concat(arry2),
        endSecondLoop;
      function loop(j, discardOrMaybe, third) {
        for (var prop in clonedObjectofObjects[discardOrMaybe]) {
          for (var i = 0; i < clonedObjectofObjects[discardOrMaybe][prop].length; i++)
            if (arr[j] == clonedObjectofObjects[discardOrMaybe][prop][i]) {
              if (discardOrMaybe === 'keepTheseOnes' && third) {
                //so we don't remove something from keepTheseOnes simply because it matches a value in one match http://jsfiddle.net/25nh54dp/44/
                third.forEach(function(keepArrayMatchValue) {
                  if (keepArrayMatchValue === arr[j]) {
                    clonedObjectofObjects[discardOrMaybe][prop].splice(i, 1);
                  }
                });
              } else {
                clonedObjectofObjects[discardOrMaybe][prop].splice(i, 1);
              }
            }
        }

        if (j < arr.length) {
          j++;
          loop(j, discardOrMaybe);
        }

        return discardOrMaybe;
      }
      var endFirstLoop = loop(0, 'possibleDiscard');

      if (endFirstLoop == 'possibleDiscard') {
        endSecondLoop = loop(0, 'maybes');
      }

      if (endSecondLoop == 'maybes' && arguments[2]) {
        loop(0, 'keepTheseOnes', arguments[2]);
      }
    }

    function goThroughKeepTheseOnesAgain() {
      var tempArray = [];
      properties.forEach(function(val, index, array) {
        clonedObjectofObjects.keepTheseOnes[val].forEach(function(value, i, arr) {
          if (arr.length < 3) {
            if (i === 0) {
              tempArray.push(val);
            }
            clonedObjectofObjects.possibleDiscard[val].push(value);
            clonedObjectofObjects.possibleDiscard[val].sort(function(a, b) {
              return a - b;
            });
          }
        });
      });
      tempArray.forEach(function(val, index, array) {
        clonedObjectofObjects.keepTheseOnes[val] = []; //EMPTY THAT SHIT OUT YO BUG FIXED!
      });
    }

    function sortDiscardPile() {
      clonedObjectofObjects.possibleDiscard[keepArray.multiple].sort(function(a, b) {
        return a - b;
      });
    }

    function compareWithkeepArray() {
      var i = 0;
      var arrrrrrray = [];
      var matchMade = false;
      var doeTheyMatch = function(num) {
        if (num === keepArray[0]) {
          if (playa !== 'firstPlayer') return keepArray[0]; //FIX THIS
        }

        if (num === keepArray[1]) {
          return keepArray[1];
        }

        if (keepArray.length > 2) {
          if (num === keepArray[2]) {
            return keepArray[2];
          }

          if (num === keepArray[3]) {
            return keepArray[3];
          }
        }
      };
      var spliceItOut = function(arr) {
        arr.forEach(function(value) {
          clonedObjectofObjects.oneMatch.forEach(function(val, index, array) {
            console.log(val);
            if (value === val) {
              clonedObjectofObjects.oneMatch.splice(index, 1);
            }
          });
        });
      };
      var checkKeepArrayMultiple = function(arrrrrrray) {
        console.log(arrrrrrray);
        if (!keepArray.multiple) return false;
        var doYourThing = function(num, arr) {
          var index = arr.indexOf(num);
          var indexOfKeepArr = keepArray.indexOf(num);
          var value;
          var odd = false;
          var even = false;
          console.log(indexOfKeepArr);
          var knowYourIndex = function(num, str) {
            if (num & 1) {
              if (str === 'getValue') {
                value =
                  keepArray[indexOfKeepArr] - keepArray[indexOfKeepArr - 1];
                odd = true;
              } else {
                return 'odd';
              }
            } else {
              if (str === 'getValue') {
                value =
                  keepArray[indexOfKeepArr + 1] - keepArray[indexOfKeepArr];
                even = true;
              } else {
                return 'even';
              }
            }
            return knowYourIndex;
          };
          var oddOrEven = knowYourIndex(indexOfKeepArr, 'getValue')(
            value,
            'getOddOrEven'
          );
          console.log(oddOrEven);
          if (oddOrEven === 'odd') return false;
          if (!!odd) {
            arr.splice(index - 2, 2);
            clonedObjectofObjects.possibleDiscard[keepArray.multiple].push(
              num - 1,
              num - 2
            );
          } else {
            //even is true
            arr.splice(index + 1, 2);
            clonedObjectofObjects.possibleDiscard[keepArray.multiple].push(
              num + 1,
              num + 2
            );
          }
          sortDiscard = true;
        };
        arrrrrrray.forEach(function(v, i, a) {
          clonedObjectofObjects.keepTheseOnes[keepArray.multiple].forEach(function(
            value,
            index,
            array
          ) {
            if (v === value) {
              doYourThing(v, array);
            }
          });
        });
      };
      if (keepArray.length > 5) return false; // they have at least
      while (i < clonedObjectofObjects.oneMatch.length) {
        var freshFeeling = doeTheyMatch(clonedObjectofObjects.oneMatch[i]);
        if (!!freshFeeling) {
          //clonedObjectofObjects.oneMatch.splice(i, 1);//fix this
          //LEFT OFF HERE - check against keepArray here
          clonedObjectofObjects.moreThanOneMatch.push(freshFeeling);
          clonedObjectofObjects.moreThanOneMatch.sort(function(a, b) {
            return a - b;
          });
          matchMade = true;
          arrrrrrray.push(freshFeeling);
        }
        i++;
      }
      if (matchMade) {
        if (!checkKeepArrayMultiple(arrrrrrray)) {
          spliceItOut(keepArray);
        }
        return arrrrrrray;
      }
    }
  },
  doWeTakeTopCard: function(junkPileContainer, obj) {
    //add maybes to it that are two in a row and possible discard that are also two in a row
    //var $topCardContainer = $deck.children(':last');
    //var $element = $topCardContainer.find(':first-child');
    //var dataValue = parseInt($element.attr('data-value'));
    var element = junkPileContainer.lastElementChild.firstChild;
    var makeArray = element.getAttribute('class').split(' ');
    var dataValue = parseInt(element.getAttribute('data-value'));
    //console.log(makeArray, dataValue);
    var prop;
    var paleBlueEyes = makeArray.splice(0, 2);
    dataValue = dataValue == 10 ? this.cardValues[paleBlueEyes[1]] : dataValue;

    var object = obj.keepTheseOnes;
    var oneMatchArray = obj.oneMatch;
    var morThanOneMatchArray = obj.moreThanOneMatch;
    var topCardComparison = function(arr, dataValue) {
      var i, j;
      var suit = arr[0];
      for (prop in object) {
        if (prop === suit) {
          if (object[suit].length) {
            var first = object[suit][0];
            var last = object[suit][object[suit].length - 1];
            if (first - 1 === dataValue) {
              return true;
            }

            if (last + 1 === dataValue) {
              return true;
            }
          }
        }
      }

      for (i = 0; i < oneMatchArray.length; i++) {
        if (dataValue === oneMatchArray[i]) {
          return true;
        }
      }

      for (j = 0; j < morThanOneMatchArray.length; j++) {
        if (dataValue === morThanOneMatchArray[j]) {
          return true;
        }
      }

      return false;
    };

    return topCardComparison(paleBlueEyes, dataValue);
  },
  shitPile: function() {
    //http://jsfiddle.net/nzmqt0g7/1/
    var arr = [];
    var i = 0;
    var prop;
    var args = arguments;

    function looping(num, i) {
      for (prop in args[i]) {
        for (var j = 0; j < args[i][prop].length; j++) {
          if (args[i][prop][j] > num) {
            arr.push('.' + prop, args[i][prop][j]);
            return arr;
          }
        }
      }

      if (num === 8) {
        arr = looping(4, 0);
        if (Array.isArray(arr)) return arr;
      }

      if (num === 4) {
        arr = looping(9, 1);
        if (Array.isArray(arr)) return arr;
      }

      if (num === 9) {
        arr = looping(3, 1);
        if (Array.isArray(arr)) return arr;
      }
    }

    arr = looping(8, i);
    return arr || 'wtf';
  },
  checkScore: function(obj) {
    //https://jsfiddle.net/uvvfuo1p/1/
    var keys = Object.keys(obj);
    var keyLength = keys.length;
    var i = 0;
    var totalCountAll = [];

    function addUpValues(arr) {
      var value = 0;
      var i = 0;
      for (i = 0; i < arr.length; i++) {
        value += arr[i];
      }

      return value;
    }

    for (i; i < keyLength; i++) {
      if (keys[i] !== 'keepTheseOnes' && keys[i] !== 'moreThanOneMatch') {
        if (Array.isArray(obj[keys[i]])) {
          for (var j = 0; j < obj[keys[i]].length; j++) {
            if (obj[keys[i]][j] > 10) {
              totalCountAll.push(parseInt(10 * 2));
            } else {
              totalCountAll.push(parseInt(obj[keys[i]][j] * 2));
            }
          }
        }

        if (typeof obj[keys[i]] === 'object') {
          // var key = Object.keys(obj[keys[i]]);
          for (var prop in obj[keys[i]]) {
            if (obj[keys[i]][prop].length) {
              for (var x = 0; x < obj[keys[i]][prop].length; x++) {
                if (obj[keys[i]][prop][x] > 10) {
                  totalCountAll.push(10);
                } else {
                  totalCountAll.push(obj[keys[i]][prop][x]);
                }
              }
            }
          }
        }
      }
    }

    return addUpValues(totalCountAll);
  },
  checkTheValueof: function(val, objectsGalore) {
    let copyOfObjectsGalore = cloneObjectOfArrays(objectsGalore);
    if (typeof val == 'string') {
      var didwegetMatch = this.checkOneMatch(
        copyOfObjectsGalore.oneMatch,
        copyOfObjectsGalore.keepTheseOnes
      );
      if (!!didwegetMatch) {
        copyOfObjectsGalore = this.removeFromOneMatchAddToMoreThanOneMatch(
          copyOfObjectsGalore,
          didwegetMatch
        );
        return [false, copyOfObjectsGalore]
      } else {
        var whichMatch = this.lookAtOneMatch(copyOfObjectsGalore.oneMatch);
        return [whichMatch, copyOfObjectsGalore]
      }
    } else {
      return [false, copyOfObjectsGalore];
    }
  },
  removeFromOneMatchAddToMoreThanOneMatch: function(obj, finalNum) {
    var oneMatch = obj.oneMatch;
    var index = oneMatch.indexOf(finalNum);
    oneMatch.splice(index, 1);
    obj.moreThanOneMatch.push(finalNum);
    return obj;
  },
  checkOneMatch: function(oneMatch, keepObj) {
    //http://jsfiddle.net/A4eJ8/5/
    var arr = this.cardSuits;
    var first = [];
    var last = [];
    var findMultiples = function(obj) {
      var foundMatch = [];
      for (var i = 0; i < arr.length; i++) {
        if (obj[arr[i]].length == 4) {
          first = obj[arr[i]].slice(0, 1);
          last = obj[arr[i]].slice(-1);
          foundMatch.push(first.join(), last.join());
        }

        if (obj[arr[i]].length == 5) {
          first = obj[arr[i]].slice(0, 1);
          last = obj[arr[i]].slice(-1);
          foundMatch.push(first, last);
        }
      }

      return foundMatch;
    };
    var compareToOneMatch = function(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == didWeFindAnything[0]) {
          // arr.push(first[0]);
          return parseInt(didWeFindAnything[0]);
        }

        if (arr[i] == didWeFindAnything[1]) {
          //  arr.push(first[1])
          return parseInt(didWeFindAnything[1]);
        }
      }
      return false;
    };
    var didWeFindAnything = findMultiples(keepObj);
    if (!!didWeFindAnything.length) {
      return compareToOneMatch(oneMatch);
    } else {
      return false;
    }
  },

  lookAtOneMatch: function(arr) {
    var i;
    var length = arr.length;
    for (i = 0; i < length; i++) {
      if (arr[i] > 4) {
        return arr[i];
      }
    }
    return arr.sort()[arr.length - 1];
  },
  findAnything: function(obj) {
    var arr = [];
    for (var prop in obj.possibleDiscard) {
      for (var i = 0; i < obj.possibleDiscard[prop].length; i++) {
        arr.push(prop, obj.possibleDiscard[prop][i]);
        return arr;
      }
    }

    for (var properti in obj.maybes) {
      for (var k = 0; k < obj.maybes[properti].length; k++) {
        arr.push(prop, obj.maybes[properti][k]);
        return arr;
      }
    }

    for (var property in obj.keepTheseOnes) {
      for (var j = 0; j < obj.keepTheseOnes[property].length; j++) {
        arr.push(property, obj.keepTheseOnes[property][j]);
        return arr;
      }
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
    /*if (this.$comp_area.find(eleClass).length > 1 && numb) {
      var extradite = checkKeepTheseOnes(keepTheseObj);
      if (extradite) {
        return this.$comp_area
          .find(eleClass)
          .not(extradite)
          .first()
          .addClass('discard');
      } else {
        return this.$comp_area
          .find(eleClass)
          .first()
          .addClass('discard');
      }
    } else {
      return this.$comp_area
        .find(eleClass)
        .first()
        .addClass('discard');
    }*/
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
      this.manipulateTheDom(showCardObj); // manipulate the DOM
      deadWoodArray = this.laySomeDeadwood(
        playerOne === 'getFirstPlayerScore' ? true : false,
        objectsGalore
      );
      console.log(deadWoodArray);
      deadWoodMatch = this.compareDeadwood(
        deadWoodArray,
        objectsGalore,
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
          fplayerOne === 'getFirstPlayerScore' ? true : false
        );
      }
      return true;
  },

  showYourCardsJoshua: function(obj) {
    console.log(obj);
    // http://jsfiddle.net/fv6Ls7fg/1/ http://jsfiddle.net/fv6Ls7fg/2/
    var stackCardsBeforeDeadwood = function() {
      //var $compPlayer = compPlayer.$comp_player;
      var compPlayer = this.DOMcomp_player;
      var compPlayerLeft = parseInt(compPlayer.style.left);
      var firstCardLeft = 51; //see dealcards first one will always be 51
      var leftPosition = compPlayerLeft + firstCardLeft;
      /*that.$comp_area //fix this statement
        .children()
        .removeAttr('style')
        .end()
        .parent()
        .css({ marginLeft: leftPosition, top: '15px' });
        */
      var children = this.DOMcomp_playerArea.children;
      Array.from(children).forEach((ele)=> {
        ele.removeAttribute('style');
      });
      this.DOMcomp_player.style.left = leftPosition + 'px';
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
    var doSomeDomManipulation = function(css_class, deadWood) {
      if (deadWood) {
        //deadWood.children().appendTo($newDom);
        Array.from(deadWood.children).forEach((ele)=>{
          $newDom.appendChild(ele);
        });

        return true;
      }
      console.log(css_class);
     /* $comp
        .find(css_class)
        .parent()
        .not('.tagged')
        .appendTo($newDom)
        .end()
        .addClass('tagged');
        */ //fix
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
      $newDom.style.width = width + 'px';
      if (compchildrenLength == 1) {
        pos = parseInt(comp.style.left) - width;
        $newDom.style.left = pos + 'px';
        //$newDom.css('left', pos + 'px');
      }

      if (compchildrenLength == 2) {
        var last = pos - parseInt($newDom.getBoundingClientRect().width) + 50;
        //$newDom.css('left', last + 'px');
        $newDom.style.left = last + 'px';
      }

      if (compchildrenLength == 3) {
        if (totalLength === 10) {
          //$newDom.css('left', '100px');
          $newDom.style.left = '100px';
        } else {
          $newDom.style.left = '50px';
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
      var compareaChildrenLength = compArea.children.length;
      //var mostLeft = parseInt($comp.children().last().css('left'));
      $newDom = createSection('leftovers');
      doSomeDomManipulation.call(this, '.wrapper', compArea);
      //$newDom.css({ left: '-85px', width: compareaChildrenLength * 85 + 'px' });
      $newDom.style.left = '-85px';
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
            /*area 
              .find(numberToLetters)
              .eq(j)
              .attr('class')
              .split(' ')[0] +
              ' ' +
              whatToFind[i] 
              
          ); */
          //or at end + numberToLetters
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
          /*that.$area
            .find('.' + string)
            .parent()
            .addClass('zooom'); */
            that.DOMplayerArea.querySelector('.'+string).parentElement.classList.add('zoom');
        } else {
          /*$('section.leftovers')
            .eq(0)
            .find('.' + string)
            .parent()
            .addClass('zooom');
            */
           leftovers.querySelector('.'+string).parentElement.classList.add('zoom');
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
           that.DOMplayerArea.querySelector(together).parentElement.classList.add('zoom');
        } else {
          /*$('section.leftovers')
            .eq(0)
            .find(together)
            .parent()
            .addClass('zooom');
            */
           leftovers.querySelector(together).parentElement.classList.add('zoom');
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
      string === 'findFirstPlayerScore'
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
 /* overlay: function(howsitgonnabe) {
    //fix this function
    console.log('overlay called');
    var $overlay = $('div.overlay'),
      $closeBttn = $overlay.find('button.overlay-close'),
      that = this,
      game_over = document.getElementById('game_over'),
      score = howsitgonnabe ? howsitgonnabe.score : null,
      startNewGame = function() {
        var $trigger = $('#trigger-overlay');
        $trigger
          .empty()
          .addClass('newGAME bubble')
          .text('Start New Match');
        $trigger.on('click', function(e) {
          e.preventDefault();
          window.location.reload(); // FIX THIS
        });
      },
      toggleOverlay = function(e) {
        e ? (e.target ? e.preventDefault() : '') : '';
        console.log(e);
        if ($overlay.hasClass('open')) {
          $overlay.removeClass('open');
          $overlay.addClass('close');
          var onEndTransitionFn = function() {
            $overlay.removeClass('close');
          };
          $overlay.on(transitionEndEvent, onEndTransitionFn);
          $(game_over).fadeOut();
          $('#intro').remove();
          console.log('open');
        } else if (!$overlay.hasClass('close')) {
          $overlay.addClass('open');
          console.log('close');
          if (e) {
            if (e.heading && e.total < 100) {
              $('#intro').hide();
              $(game_over).fadeIn();
              game_over.querySelector('h1').innerHTML = howsitgonnabe.heading;
              game_over.querySelector('h2').innerHTML = howsitgonnabe.text;
            }

            if (e.heading && e.total >= 100) {
              //END OF GAME NOT MATCH
              $(game_over).fadeIn();
              if (howsitgonnabe.win === 'You') {
                game_over.querySelector('h1').innerHTML =
                  "Congratualations You won the game but I'll get you next time, Gadget! NEXT time!";
                game_over.querySelector('h2').innerHTML =
                  'You scored a total of ' + howsitgonnabe.total + ' points';
                that.congratulations(true);
              } else {
                //joshua won
                game_over.querySelector('h1').innerHTML =
                  "Joshua and O'Doyle Rules - GAME OVER!";
                game_over.querySelector('h2').innerHTML =
                  'Joshua scored a total of ' + howsitgonnabe.total + ' points';
                that.congratulations();
              }
              return true;
            }
          }
        } else {
          $overlay.addClass('open');
        }

        if (e) {
          if (e.data) {
            if (e.data.score) {
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
              rummy.$htmlDeck
                .children(':last-child')
                .find('div')
                .children('a.take')
                .hide();
              that.updateScore(howsitgonnabe);
              startNewGame();
              //create new game
            }
          }
        }
      };

    if (howsitgonnabe) {
      var endOfGame = toggleOverlay(howsitgonnabe);
      if (endOfGame) return true;
    }

    $closeBttn.off('click').on(
      'click',
      {
        score: score
      },
      toggleOverlay
    );

    if (window.localStorage.getItem('modal') !== 'falsy') {
      this.$intoIframe.insertBefore($(game_over));
      toggleOverlay();
      window.setTimeout(function() {
        document.getElementById('shallWePlayAGame').play();
      }, 2000);
    }

    window.localStorage.setItem('modal', 'falsy');
    //window.localStorage.clear(); //for testing purposes
  },
  */
};
export default RUMMY;
