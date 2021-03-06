import { cardValues, cloneObjectOfArrays } from '../utils';
import { cardArray, cardSuits } from '../constants';


function checkOneMatch (oneMatch, keepObj) {
    //http://jsfiddle.net/A4eJ8/5/
    var arr = cardSuits;
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
}

function removeFromOneMatchAddToMoreThanOneMatch (obj, finalNum)  {
    var oneMatch = obj.oneMatch;
    var index = oneMatch.indexOf(finalNum);
    oneMatch.splice(index, 1);
    obj.moreThanOneMatch.push(finalNum);
    return obj;
}

function lookAtOneMatch(arr) {
    var i;
    var length = arr.length;
    for (i = 0; i < length; i++) {
      if (arr[i] > 4) {
        return arr[i];
      }
    }
    return arr.sort()[arr.length - 1];
}

function findAnything (obj) {
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
}

export function furtherFilter (arr) {
    const obj = {};
    arr.forEach(value => {
      if (!obj[value[0]]) {
        obj[value[0]] = [];
      }
      obj[value[0]].push(cardValues[value[1]]);
    });
    return obj;
}

export function sortObjOfArrays (object) {
    var copy = cloneObjectOfArrays(object);
    cardSuits.forEach(value => {
      if (!object[value]) {
        copy[value] = [];
      } 
      copy[value].sort((a, b) => {
        return a - b;
      });
    });
    return copy;
}

export function decideWhichOnesToKeep (obj) {
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
}

export function findMatches (objOfObjects, playa) {
    //SOLUTION http://jsfiddle.net/25nh54dp/34/ // http://jsfiddle.net/25nh54dp/37/ line ~516 -- FIX THIS http://jsfiddle.net/25nh54dp/38/(screenshot)
    //http://jsfiddle.net/25nh54dp/40/
    const clonedObjectofObjects = cloneObjectOfArrays(objOfObjects);
    var properties = cardSuits;
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
          if (playa !== 'firstPlayerKnock') return keepArray[0]; //FIX THIS
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
}

export function doWeTakeTopCard (junkPileContainer, obj) {
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
    dataValue = dataValue == 10 ? cardValues[paleBlueEyes[1]] : dataValue;

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
}

export function checkScore (obj) {
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
}

export function shitPile () {
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
}

export function checkTheValueof (val, objectsGalore) {
    let copyOfObjectsGalore = cloneObjectOfArrays(objectsGalore);
    if (typeof val == 'string') {
        var didwegetMatch = checkOneMatch(
        copyOfObjectsGalore.oneMatch,
        copyOfObjectsGalore.keepTheseOnes
        );
        if (!!didwegetMatch) {
        copyOfObjectsGalore = removeFromOneMatchAddToMoreThanOneMatch(
            copyOfObjectsGalore,
            didwegetMatch
        );
        return [false, copyOfObjectsGalore]
        } else {
        var whichMatch = lookAtOneMatch(copyOfObjectsGalore.oneMatch);
        return [whichMatch, copyOfObjectsGalore]
        }
    } else {
        return [false, copyOfObjectsGalore];
    }
}

export function finalFilterFunc(whatCardToRidThisTime, total, objectsGalore) {
    let finalTotal = 0;
    let stringToDiscard = '';
    if (typeof whatCardToRidThisTime === 'number') {
      finalTotal = total - whatCardToRidThisTime;
      stringToDiscard = '.' + cardArray[whatCardToRidThisTime - 1];
    } else {
      if (whatCardToRidThisTime === 'wtf') {
        whatCardToRidThisTime = findAnything(objectsGalore);
      }
      finalTotal =
        total - (whatCardToRidThisTime[1] > 10 ? 10 : whatCardToRidThisTime[1]);
      whatCardToRidThisTime[1] =
        '.' + cardArray[whatCardToRidThisTime[1] - 1];
      stringToDiscard = whatCardToRidThisTime.join(''); //hopefully fixed - should produce .clubs.ten
    }
    return {
      finalTotal,
      stringToDiscard,
      whatCardToRidThisTime
    };
}

