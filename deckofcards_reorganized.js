// NEED TO MOVE THIS PART SOMEWHERE ELSE maybe a file called dependecies 
/* global $ */
/* global window */
/* global document */
/* global console */
$.fn.removeStyle = function (style) {
    var search = new RegExp(style + '[^;]+;?', 'g');
    return this.each(function () {
        $(this).attr('style', function (i, style) {
            return style.replace(search, '');
        });
    });
};
Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};

var transitionEndEvent = (function () {
    var dummyStyle = document.createElement('div').style;
    var vendor = (function () {
        var vendors = 't,webkitT,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = vendors.length;

        for (; i < l; i++) {
            t = vendors[i] + 'ransform';
            if (t in dummyStyle) {
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }

        return false;
    })();

    if (vendor === false) return false;
    var transitionEnd = {
        '': 'transitionend',
        'webkit': 'webkitTransitionEnd',
        'Moz': 'transitionend',
        'O': 'oTransitionEnd',
        'ms': 'MSTransitionEnd'
    };

    return transitionEnd[vendor];


}());
// END OF NEEDING TO MOVE THIS PART SOMEWHERE ELSE
function RUMMY() {}
RUMMY.prototype = {

    discard: function ($discard, $obj) {      
        $discard.removeClass('discard');
        var $siblings = $obj.siblings();
        var $deck = this.$htmlDeck;
        var $area = this.$area;
        $siblings.find('a').removeClass('discard').parent().removeClass('taketopCard');
        var $lastChild = $deck.children(':last-child');
        var lastChildPosition = $lastChild.position().left;
        var lastChildzIndex = parseInt($lastChild.css('z-index'));
        if ($lastChild.hasClass('showdacard') || $lastChild.hasClass('player') || $lastChild.hasClass('comp_player')) {
            $obj.appendTo($deck).css({
                'z-index': lastChildzIndex + 1,
                "left": lastChildPosition + 23,
                "top": '32px'
            }).addClass('delt');
        } else {
            $obj.appendTo($deck).css({
                'z-index': lastChildzIndex + 1,
                "left": '200px',
                "top": '32px'
            }).addClass('delt');
        }
        if (!!player.knocked) {
            this.preFilteringOfCreateArray($area.children(), 'firstPlayer');
            player.knocked = false;
            if (!!player.legitimateKnock) {
                this.preFilteringOfCreateArray(this.$comp_area.children(), 'computer');
                return false;
            }
        }

        if (!!arguments[3]) {
            this.preFilteringOfCreateArray($area.children(), 'findFirstPlayerScore');
            return false;
        }
        if (arguments[2] !== 'donotrun') {
            compPlayer.index ++;
            window.setTimeout(function () {               
                compPlayer.takeNextCard();
            }, 1000);
        }


    },

    //the funking nuclues oh i dont curse ... 
    preFilteringOfCreateArray: function ($obj, player) {
        var suitNCardArray = [];
        var computerDeck = [];
        $obj.children(':first-child').each(function () {
            var suit_card_n_value = $(this).attr('class').split(' ');
            var value = suit_card_n_value[1];
            computerDeck.push(value);
            suitNCardArray.push(suit_card_n_value);
        });

        var topCard = this.startTheProcess(suitNCardArray, player);
        return (!!topCard) ? true : false;

    },

    //the nuclues
    startTheProcess: function (withSuit, playerOne) {
        var that = this;
        var computerKnock = false; //has the computer knocked
        var objectsGalore = {}; //object of ojbects with each hand
        var total = 0; // total before discarding last card
        var whatCardToRidThisTime = null;
        var valueOfCard = null;
        var stringToDiscard = null;
        var finalTotal = null;
        var $frontSideOfCardToBeDiscarded = null;
        var $cardToBeDiscarded = null;

        var createObjectsGalore = function () {
            var filterOutArrayOfArraysObj = that.furtherFilter(withSuit); // returns obj { clubs: [6], diamonds: [3, 1, 4], hearts: [10, 5, 12], etc } unsorted
            var sortedObj = that.sortObjOfArrays(filterOutArrayOfArraysObj); // sorts the above arrays within the object
            //console.dir(sortedObj);
            var sortedObjects = that.decideWhichOnesToKeep(sortedObj);
            //console.dir(sortedObjects);
            // filtering suits/numbers in order returns object with objects of arrays { keepTheseOnes:{ clubs: [1], diamonds:[]} maybes: {}, possibleDiscard etc}
            var objectsGalore = that.findMatches(sortedObjects, playerOne); // adds to properties to the object
            return objectsGalore;
        };

        objectsGalore = createObjectsGalore();

        if (playerOne === 'topCard') { //does computer player take top Card
            return this.doWeTakeTopCard(this.$htmlDeck, objectsGalore);
        }

        total = this.checkScore(objectsGalore);
        if (playerOne === 'firstPlayer') {
            if (total <= 10) {
                player.legitimateKnock = true;
                player.firstPersonScore = total;
                player.deck = objectsGalore;
            } else {
                window.alert("you don't have enough to knock");
            }
            return false;
        }
        
        if (this.beginningOfTheEnd(playerOne, total, objectsGalore)){
            return false;
        } 

        whatCardToRidThisTime = this.shitPile(objectsGalore.possibleDiscard, objectsGalore.maybes, objectsGalore.oneMatch);
        console.log(whatCardToRidThisTime);
        valueOfCard = this.checkTheValueof(whatCardToRidThisTime, objectsGalore); 
        console.log(valueOfCard);
        console.log(total);
        if (valueOfCard) whatCardToRidThisTime = valueOfCard;
        if (typeof whatCardToRidThisTime === 'number' ) {          
            finalTotal = total - whatCardToRidThisTime;
            stringToDiscard = "." + this.cardArray[whatCardToRidThisTime - 1];
        } else {
            if (whatCardToRidThisTime === 'wtf') whatCardToRidThisTime = this.findAnything(objectsGalore);
            finalTotal = total - ((whatCardToRidThisTime[1] > 10) ? 10 : whatCardToRidThisTime[1]);
            whatCardToRidThisTime[1] = '.' + this.cardArray[whatCardToRidThisTime[1] - 1];
            stringToDiscard = whatCardToRidThisTime.join(''); //hopefully fixed - should produce .clubs.ten
            
        }
        console.log(finalTotal);
        if (finalTotal < 10 && playerOne !== 'computer') {
            computerKnock = true;
            compPlayer.score = finalTotal;
            compPlayer.deck = objectsGalore;
            
        }


        
        $frontSideOfCardToBeDiscarded = this.findCardtoDiscard(stringToDiscard, objectsGalore.keepTheseOnes, typeof whatCardToRidThisTime === 'number' ? whatCardToRidThisTime : null); 
        console.log($frontSideOfCardToBeDiscarded);
        $cardToBeDiscarded = $frontSideOfCardToBeDiscarded.parent();
        compPlayer.parentInfoObj = this.getStyles($cardToBeDiscarded);
        $frontSideOfCardToBeDiscarded.addClass('taketopCard').find('a').text(this.takeCard).addClass('take');
        $cardToBeDiscarded.addClass('flipit');
        this.discard($frontSideOfCardToBeDiscarded, $cardToBeDiscarded, 'donotrun', computerKnock);
        $('#takeCard').removeAttr('disabled').next('#knock').attr('disabled', true);

        return false;

    },

    doWeTakeTopCard: function ($deck, obj) { //add maybes to it that are two in a row and possible discard that are also two in a row
        var $topCardContainer = $deck.children(':last');
        var $element = $topCardContainer.find(':first-child');
        var dataValue = parseInt($element.attr('data-value'));
        var makeArray = $element.attr('class').split(' ');
        var prop;
        var paleBlueEyes = makeArray.splice(0, 2);
        dataValue = (dataValue == 10) ? this.cardValues[paleBlueEyes[1]] : dataValue;

        var object = obj.keepTheseOnes;
        var oneMatchArray = obj.oneMatch;
        var morThanOneMatchArray = obj.moreThanOneMatch;
        var topCardComparison = function (arr, dataValue) {
            var i, j;
            var suit = arr[0];
            for (prop in object) {
                if (prop === suit) {
                    if (object[suit].length) {
                        var first = object[suit][0];
                        var last = object[suit][object[suit].length - 1];
                        if ((first - 1) === dataValue) {
                            return true;
                        }

                        if ((last + 1) === dataValue) {
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

    findCardtoDiscard: function (eleClass, keepTheseObj, numb) {
        var checkKeepTheseOnes = function () {
            var classy = null;
            var keys = Object.keys(keepTheseObj);
            keys.forEach(function (val) {
                keepTheseObj[val].forEach(function (value) {
                    if (value === numb) {
                        classy = "." + val; 
                    }
                });
            });
            
            return classy;
            
        };
        if ((this.$comp_area.find(eleClass).length > 1) && numb) {
            var extradite = checkKeepTheseOnes(keepTheseObj);
            if (extradite) {
               return this.$comp_area.find(eleClass).not(extradite).first().addClass('discard'); 
            } else {
               return this.$comp_area.find(eleClass).first().addClass('discard'); 
            }
        } else {
            return this.$comp_area.find(eleClass).first().addClass('discard');
        }

    },

    furtherFilter: function (arr) {
        var obj = {};
        var that = this;
        arr.forEach(function(value) {
            if (!obj[value[0]]) obj[value[0]] = [];
            obj[value[0]].push(that.cardValues[value[1]]);   
        });
        return obj;
    },

    sortObjOfArrays: function (object) {
        this.each_suit.forEach(function(value) {
            if (!object[value]) object[value] = [];
            object[value].sort(function(a, b) {
                return a - b;
            });
        });
        
        return object;
    },
    
    decideWhichOnesToKeep:function (obj) { //http://jsfiddle.net/9joukzhv/1/ - http://jsfiddle.net/9joukzhv/2/
        var keepTheseOnes = {};
        var maybes = {};
        var possibleDiscard = {};
        var keys = Object.keys(obj);
        var arrr = [];

        var checkToSeeIfItsInArray = function (prev, val, next) {
                var prevInArray = false;
                var valInArray = false;
                var nextInArray = false;
                arrr.forEach(function (value) {
                        if (value == prev) prevInArray = true;
                        if (value == val) valInArray = true;
                        if (value == next) nextInArray = true;
                });

                if (!prevInArray) arrr.push(prev);
                if (!valInArray) arrr.push(val);
                if (!nextInArray) arrr.push(next);
        };

        var getDifference = function (arr1, arr2) {
                var ret = [];
                arr1.forEach(function(value) {
                        if(arr2.indexOf(value) == -1) {
                                ret.push(value);   
                        }     
                });
                return ret;
        };
	
        keys.forEach(function (value) {
            keepTheseOnes[value] = keepTheseOnes[value] || [];
            possibleDiscard[value] = possibleDiscard[value] || [];
            maybes[value] = maybes[value] || [];
            if (obj[value].length) {
                if (obj[value].length ==1) possibleDiscard[value].push(obj[value][0]);
                obj[value].reduce(function (prevValue, current, index, arr) {
                    if (((current - prevValue) ==1) || ((current + 1) == arr[index+1]) ) {
                        if (arr[0] +1 == arr[1] && arr[0] == prevValue) {
                            keepTheseOnes[value].push(prevValue, current);
                        } else {
                            if (arr[0] + 1 != arr[1] && index == 1) {
                                    possibleDiscard[value].push(arr[0]);
                            }
                            keepTheseOnes[value].push(current);  
                        }
                    } else {
                        if (index ==1) {
                            possibleDiscard[value].push(prevValue, current);
                        } else {
                            possibleDiscard[value].push(current);
                        }
                    }
                    return arr[index];
                });
            }
		
            keepTheseOnes[value].forEach(function (value, i, arr) {
                if (((value - 1) === arr[i-1]) && ((value +1) == arr[i+1])) {
                   checkToSeeIfItsInArray(value -1, value, value + 1);        
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
    
    shitPile: function () { //http://jsfiddle.net/nzmqt0g7/1/
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

    findMatches: function (objOfObjects, playa) { //SOLUTION http://jsfiddle.net/25nh54dp/34/ // http://jsfiddle.net/25nh54dp/37/ line ~516 -- FIX THIS http://jsfiddle.net/25nh54dp/38/(screenshot)
        //http://jsfiddle.net/25nh54dp/40/
        var properties = this.each_suit;
        var testArray = [];
        var keepArray = [];
        var sortDiscard = false;
        var keysOfObjects = Object.keys(objOfObjects);
        var multipleHandsOneSuit = function (arr, suit) {
            if (arr.length > 7) return false;
            arr.some(function (value, index, array) {
                if (value + 1 !== array[index +1]) {
                    keepArray.push(array[0], value, array[index +1], array[array.length - 1]);
                    keepArray.multiple = suit || false;
                    return keepArray;
                } 
            });
        };
        keepArray.multiple = false;
        
        keysOfObjects.forEach(function (value, i, arr) {
            if (value === "keepTheseOnes") {
                properties.forEach(function (val, index, array) {					
                    var first, last, middle;
                    if(objOfObjects[value][val].length >= 3){
                        if (objOfObjects[value][val][objOfObjects[value][val].length - 1] - (objOfObjects[value][val][0]) !== objOfObjects[value][val].length - 1) {
                            multipleHandsOneSuit(objOfObjects[value][val], val);
                        }  else {
                            first = objOfObjects[value][val][0];
                            last =  objOfObjects[value][val][objOfObjects[value][val].length - 1];
                            if (objOfObjects[value][val].length === 3) {
                                middle = objOfObjects[value][val][1];
                                keepArray.push(first, middle, last);
                            } else {
                                keepArray.push(first, last);
                            }
                             
                        }                  
                    }
                });
            } else {
                properties.forEach(function (val, index, arrary) {
                    objOfObjects[value][val].forEach(function(v, ind, ar) {
                            testArray.push(v);
                    });
                });
            }
        });

        testArray.sort(function (a, b) {
            return a - b;
        });

        objOfObjects.oneMatch = [];
        objOfObjects.moreThanOneMatch = [];

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
                    objOfObjects.oneMatch.push(parseInt(prop));
                    matches = true;

                }

                if (counts[prop] > 2) {
                    objOfObjects.moreThanOneMatch.push(parseInt(prop));
                    matches = true;
                }


            }
            return matches;
        }
        var matches = findDupes(testArray);

        if (!!matches) {
            var keepArrayMatches = compareWithkeepArray();
            removeFromDiscard(objOfObjects.oneMatch, objOfObjects.moreThanOneMatch, keepArrayMatches);
            goThroughKeepTheseOnesAgain();
            if (!!sortDiscard) sortDiscardPile();
            return objOfObjects;
        } else {
            return objOfObjects;
        }


        function removeFromDiscard(arr1, arry2) {
            var arr = arr1.concat(arry2),
                endSecondLoop;
            function loop(j, discardOrMaybe, third) {
                for (var prop in objOfObjects[discardOrMaybe]) {
                    for (var i = 0; i < objOfObjects[discardOrMaybe][prop].length; i++)
                        if (arr[j] == objOfObjects[discardOrMaybe][prop][i]) {
                            if (discardOrMaybe === 'keepTheseOnes' && third) { //so we don't remove something from keepTheseOnes simply because it matches a value in one match http://jsfiddle.net/25nh54dp/44/
                                third.forEach(function (keepArrayMatchValue) {
                                    if (keepArrayMatchValue === arr[j]) {
                                        objOfObjects[discardOrMaybe][prop].splice(i, 1);
                                    }
                                });
                            } else {
                                objOfObjects[discardOrMaybe][prop].splice(i, 1); 
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

            if (endFirstLoop == "possibleDiscard") {
                endSecondLoop = loop(0, 'maybes');
            }

            if (endSecondLoop == "maybes" && arguments[2]) {
                loop(0, 'keepTheseOnes', arguments[2]);
            }
        }
        
        function goThroughKeepTheseOnesAgain () {
            var tempArray = [];
            properties.forEach(function (val, index, array) {
                objOfObjects.keepTheseOnes[val].forEach(function (value, i, arr) {
                    if (arr.length < 3) {
                        if (i === 0 ) {tempArray.push(val);}
                        objOfObjects.possibleDiscard[val].push(value);
                        objOfObjects.possibleDiscard[val].sort(function (a, b) {
                            return a - b;
                        });
                    }
                }); 
            });
            tempArray.forEach(function (val, index, array) {
                    objOfObjects.keepTheseOnes[val] = [];  //EMPTY THAT SHIT OUT YO BUG FIXED!
            });
        }
        
        function sortDiscardPile () {
            objOfObjects.possibleDiscard[keepArray.multiple].sort(function (a, b) {
                return a - b;
            });
        }


        function compareWithkeepArray() { 
            var i = 0;
            var arrrrrrray = [];
            var matchMade = false;
            var doeTheyMatch = function (num) { 
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
            var spliceItOut = function (arr) {
	           arr.forEach(function (value) {
		          objOfObjects.oneMatch.forEach(function (val, index, array) {
                      console.log(val);
                      if (value === val) {
                        objOfObjects.oneMatch.splice(index, 1);
                      }
		          });	
                });
            };
            var checkKeepArrayMultiple = function (arrrrrrray) {
                console.log(arrrrrrray);
                if (!keepArray.multiple) return false;
                var doYourThing = function (num, arr) {
                    var index = arr.indexOf(num);
                    var indexOfKeepArr = keepArray.indexOf(num);
                    var value;
                    var odd = false;
                    var even = false;
                    console.log(indexOfKeepArr);
                    var knowYourIndex = function (num, str) {
                        if (num & 1) {
                            if (str === "getValue") {
                             value = keepArray[indexOfKeepArr] - keepArray[indexOfKeepArr-1];
                             odd = true;
                            } else {
                                return "odd";
                            }
                        } else {
                            if (str === "getValue") {
                                value = keepArray[indexOfKeepArr+1] - keepArray[indexOfKeepArr];
                                even = true;
                            } else {
                                return "even";
                            }
                        }
                        return knowYourIndex;
                    };
                    var oddOrEven = knowYourIndex(indexOfKeepArr, 'getValue')(value, 'getOddOrEven');
                    console.log(oddOrEven);
                    if (oddOrEven === "odd") return false;
                    if (!!odd) {
                        arr.splice(index-2, 2);
                        objOfObjects.possibleDiscard[keepArray.multiple].push(num-1, num-2);
                    } else { //even is true
                        arr.splice(index+1, 2);
                        objOfObjects.possibleDiscard[keepArray.multiple].push(num+1, num+2);
                    }
                    sortDiscard = true;
                };
                arrrrrrray.forEach(function (v,i,a) { 
                    objOfObjects.keepTheseOnes[keepArray.multiple].forEach(function(value, index, array) {
                            if (v === value ) {
                                doYourThing(v, array);
                            }
                    });
                });
            };
            if (keepArray.length > 5) return false; // they have at least
            while (i < objOfObjects.oneMatch.length) {
                var freshFeeling = doeTheyMatch(objOfObjects.oneMatch[i]);
                if (!!freshFeeling) {
                    //objOfObjects.oneMatch.splice(i, 1);//fix this
                    //LEFT OFF HERE - check against keepArray here 
                    objOfObjects.moreThanOneMatch.push(freshFeeling);
                    objOfObjects.moreThanOneMatch.sort(function(a,b) {return a-b;});
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

    checkTheValueof: function (val, objectsGalore) { 
        if (typeof val == 'string') {
            var didwegetMatch = this.checkOneMatch(objectsGalore.oneMatch, objectsGalore.keepTheseOnes);
            if (!!didwegetMatch) {
                objectsGalore = this.removeFromOneMatchAddToMoreThanOneMatch(objectsGalore, didwegetMatch);
            } else {
                var whichMatch = this.lookAtOneMatch(objectsGalore.oneMatch);
                return whichMatch;
            }
        } else {
            return false;
        }
    },

    removeFromOneMatchAddToMoreThanOneMatch: function (obj, finalNum) {
        var oneMatch = obj.oneMatch;
        var index = oneMatch.indexOf(finalNum);
        oneMatch.splice(index, 1);
        obj.moreThanOneMatch.push(finalNum);
        return obj;
    },

    checkOneMatch: function (oneMatch, keepObj) {
        //http://jsfiddle.net/A4eJ8/5/
        var arr = this.each_suit;
        var first = [];
        var last = [];
        var findMultiples = function (obj) {
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
        var compareToOneMatch = function (arr) {
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

    lookAtOneMatch: function (arr) {
        var i;
        var length = arr.length;
        for (i = 0; i < length; i++) {
            if (arr[i] > 4) {
                return arr[i];
            }
        }
        return arr.sort()[arr.length - 1];
    },
    
    findAnything: function (obj) {
        var arr = [];
        for (var prop in obj.possibleDiscard) {
            for (var i =0; i<obj.possibleDiscard[prop].length; i++) {
               arr.push(prop, obj.possibleDiscard[prop][i] );
               return arr;
                
            }
        }
        
        for (var properti in obj.maybes) {
            for (var k =0; k<obj.maybes[properti].length; k++) {
               arr.push(prop, obj.maybes[properti][k] );
               return arr;
                
            }
        }
        
        for (var property in obj.keepTheseOnes) {
            for (var j =0; j<obj.keepTheseOnes[property].length; j++) {        
              arr.push(property, obj.keepTheseOnes[property][j]);
              return arr;
            }
        }
        
    },

    checkScore: function (obj) { //https://jsfiddle.net/uvvfuo1p/1/
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
            if (keys[i] !== "keepTheseOnes" && keys[i] !== "moreThanOneMatch") {
                if (Array.isArray(obj[keys[i]])) {
                    for (var j = 0; j < obj[keys[i]].length; j++) {
                        if (obj[keys[i]][j] > 10) {
                            totalCountAll.push(parseInt(10 * 2));
                        } else {
                            totalCountAll.push(parseInt((obj[keys[i]][j]) * 2));
                        }

                    }
                }

                if ($.isPlainObject(obj[keys[i]])) {
                    // var key = Object.keys(obj[keys[i]]);
                    for (var prop in obj[keys[i]]) {
                        if (obj[keys[i]][prop].length) {
                            for (var x = 0; x < obj[keys[i]][prop].length; x++) {
                                if (obj[keys[i]][prop][x] > 10) {
                                    totalCountAll.push(10);
                                } else {
                                    totalCountAll.push((obj[keys[i]][prop][x]));
                                }

                            }
                        }
                    }
                }
            }
        }

        return addUpValues(totalCountAll);
    },



    getStyles: function ($ele) {
        var obj = {};
        obj.top = $ele.css('top');
        obj.left = $ele.css('left');
        obj.zIndex = $ele.css('zIndex');
        obj.index = $ele.index();
        return obj;
    },

    makeLoveNotTupperWar: function (score, string, win) {
        var obj = {};
        obj.heading = win ? "Congratulations You Won this hand " : "Sorry you lost this hand";
        obj.win = win ? "You" : "Joshua";
        obj.text = string === 'findFirstPlayerScore' ? obj.win + ' scored ' + score + ' points' : obj.win + ' scored ' + score + ' points';
        obj.score = score;
        obj.total = this.getExistingWinnerTotal(obj.win) + obj.score;
        console.log('calledmakeloveNotupper');
        this.overlay(obj);
        
    },
    
    getExistingWinnerTotal: function (winner) {
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
    
    beginningOfTheEnd: function (playerOne, total, objectsGalore) {
        if (!playerOne) return false;
        if (playerOne === 'computer' || playerOne === 'findFirstPlayerScore') {
            var finalScore = 0,
                firstplayerScore = false,
                computerScore = 0,
                showCardObj = null,
                deadWoodArray = [],
                deadWoodMatch = null,
                whatToMinusInARow = [],
                whatToMinusMatch = [],
                whatToMinus = 0;
            if (playerOne === 'findFirstPlayerScore') { //computer has knocked
                firstplayerScore = true;    
                finalScore = total - compPlayer.score;
                console.log(compPlayer.score);
                if (compPlayer.score === 0) finalScore = finalScore + 20; //if computer scores gin rummy perfect hand    
            } else { //'computer'
                compPlayer.score = computerScore = total;
                finalScore = computerScore - player.firstPersonScore;
                if (player.firstPersonScore === 0) finalScore = finalScore + 20;
            }
            showCardObj = this.showYourCardsJoshua((firstplayerScore) ? compPlayer.deck : objectsGalore);
            this.manipulateTheDom(showCardObj);// manipulate the DOM
            deadWoodArray = this.laySomeDeadwood((firstplayerScore) ? true : false, objectsGalore);
            console.log(deadWoodArray);
            deadWoodMatch = this.compareDeadwood(deadWoodArray, (firstplayerScore) ? compPlayer.deck : player.deck, (firstplayerScore) ? 'joshua' : false);
            console.log(deadWoodMatch);

            if (deadWoodMatch){
               if (deadWoodMatch.inaRow.length) {
                    whatToMinusInARow = this.addOnYourDeadwoodToOpponet(deadWoodMatch.inaRow, 'inarow', playerOne);
                }
                if (deadWoodMatch.match.length) {
                    whatToMinusMatch = this.addOnYourDeadwoodToOpponet(deadWoodMatch.match, 'match', playerOne);                  
                }
                whatToMinus = this.loopThroughWhatToMinus(whatToMinusInARow, whatToMinusMatch );        
                finalScore = (finalScore < 0) ? 0 - whatToMinus : finalScore - whatToMinus;
            }  

            if (finalScore > 0) {
                this.makeLoveNotTupperWar(finalScore, playerOne, (firstplayerScore) ? false : true);
            } else {
                this.makeLoveNotTupperWar(Math.abs(finalScore) + 10, playerOne, (firstplayerScore) ? true : false);
            }
            return true; 
        } else {
            return false;
        }
    },
    
    
    showYourCardsJoshua: function (obj) {

       // http://jsfiddle.net/fv6Ls7fg/1/ http://jsfiddle.net/fv6Ls7fg/2/
        var that = this;
        var stackCardsBeforeDeadwood = function () {
            var $compPlayer = compPlayer.$comp_player;
            var compPlayerMarginLeft = parseInt($compPlayer.css('marginLeft'));
            var firstCardLeft = 51; //see dealcards first one will always be 51
            var leftPosition = compPlayerMarginLeft + firstCardLeft; 
            that.$comp_area.children().removeAttr('style').end().parent().css({'marginLeft': leftPosition, 'top': '15px'});

        };
        
        stackCardsBeforeDeadwood();
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
        //this.cardArray[whatCardToRidThisTime - 1]
        
        for (prop in keep) {
            for (var i = 0; i<keep[prop].length; i++) {
                object[prop][i] = "." + prop + "." + this.cardArray[keep[prop][i] - 1];
            }
            
        }
        
        for (var j=0; j<moreThanOneMatch.length; j++) {
            matchArray.push("."+this.cardArray[moreThanOneMatch[j] - 1]);
        }
        
        
        object.match = matchArray;
        console.log(object);
        
        return object;
        
    },
    
    manipulateTheDom: function (obj) {
        console.log(obj);
        var prop;
        var match = obj.match;
        var $comp = compPlayer.$comp_player;
        var $newDom = null;
        var pos = null;
        var totalLength = 0;
        var doSomeDomManipulation = function (css_class, $deadWood) {
            if ($deadWood) {
                $deadWood.children().appendTo($newDom);
                return true;
            }
            $comp.find(css_class).parent().not('.tagged').appendTo($newDom).end().addClass('tagged');
        };
        
        var figureOutChildrenAndPlacement = function (len, $newDom) { //len is not used
            var compchildrenLength = $comp.children().length;
            var newDomChildrenLength = $newDom.children().length;
            totalLength += newDomChildrenLength;
            var width = newDomChildrenLength * 85;
            $newDom.css('width',width); //85 children width
            if (compchildrenLength == 1) {
               pos = compPlayer.lastInDeck - width;
               $newDom.css('left', pos + 'px'); 
            }
            
            if (compchildrenLength == 2) {
                var last = pos - parseInt($newDom.outerWidth() + 50);
                $newDom.css('left', last + 'px');
            }
            
            if (compchildrenLength == 3) {
                if (totalLength === 10) {
                   $newDom.css('left', '100px'); 
                } else {
                   $newDom.css('left', '50px'); 
                } 
            }
            $newDom.appendTo($comp);
        };
        
        var createSection = function (property) {
            var classy = property + ' runs_wrapper'; 
            return $("<section class=' " + classy + " '></section>");
        };
        
        var whatToDoWithTheRest = function ($compArea) {
            var $children = $compArea.children();
            var compareaChildrenLength = $children.length;
            //var mostLeft = parseInt($comp.children().last().css('left'));
            $newDom = createSection('leftovers');
            doSomeDomManipulation('.wrapper',$compArea );
            $newDom.css({'left': '-85px', 'width': (compareaChildrenLength * 85) + 'px'} );
            $newDom.appendTo($comp);
            $compArea.remove(); /* IMPORTANT */
        };
        for (prop in obj) {
            if (prop !== "match" && obj[prop].length) {
                $newDom = createSection(prop); 
                for (var i=0; i<obj[prop].length; i++) {
                    doSomeDomManipulation(obj[prop][i]);
                }
                figureOutChildrenAndPlacement(obj[prop].length, $newDom);
            }           
        }
        
            
        
        for (var j=0; j<match.length; j++) {
            var property = 'match' + j;
            $newDom = createSection(property);
            doSomeDomManipulation(match[j]);
            figureOutChildrenAndPlacement(null, $newDom);
        }
        
        whatToDoWithTheRest(this.$comp_area);
        //what do we do with deadwood?
         
            
    },
    
    laySomeDeadwood: function (joshuKnocked, notKnocker) {
        var $area = null;
        var deadWooodCardsArray = [];
        var that = this;
        var findOneMatch = function (whatToFind) {
            for (var i=0; i<whatToFind.length; i++) {
                for(var j=0; j<2; j++) { // 2 is a match 
                    var numberToLetters = "."+that.cardArray[whatToFind[i] - 1];
                    deadWooodCardsArray.push($area.find(numberToLetters).eq(j).attr('class').split(' ')[0] + ' ' +whatToFind[i]);  // or at end + numberToLetters 
                }
            }
        };
        
        var findMaybesOrPossibleDiscards = function (whatToFind) {
            for (var prop in whatToFind )
                for (var i=0; i<whatToFind[prop].length; i++) {
                    deadWooodCardsArray.push(prop + ' ' +whatToFind[prop][i] );
                }
        };

        
        var giveFirstPlayerHints = function (obj)  {
            var oneMatch = obj.oneMatch;  //returns array [5]
            var maybes = obj.maybes;
            var possibleDiscard = obj.possibleDiscard;
            findOneMatch(oneMatch);
            findMaybesOrPossibleDiscards(maybes);
            findMaybesOrPossibleDiscards(possibleDiscard);
            return deadWooodCardsArray;
        };
        
        
        if (joshuKnocked) {
            $area = this.$area;
        } else {
            $area = $('.leftovers');  // what if computer has rummy after you knocked - fat chance but it could happen!   
        }
        
        return giveFirstPlayerHints(notKnocker);
        

    },
    
    compareDeadwood: function (deadwood, deck, joshua) {
        var moreThanOneMatch = deck.moreThanOneMatch;
        var inARow = deck.keepTheseOnes;
        var deadlength = deadwood.length;
        var matches = false;
        
        // make utility function
        var extractNumber = function (deadString) {
            return parseInt(deadString.match(/\d+/));
        };
        
        // make utility function
        var extractString = function (strWithNum) {
            var strIndex = strWithNum.indexOf(" ");
            return strWithNum.slice(0, strIndex);
        };
        
        var canWeAddToExistingMatch = function () {
            var arr =[];
            var compareIt = function (number) {
                for (var j=0; j<moreThanOneMatch.length; j++) {
                    if (number === moreThanOneMatch[j]) {
                        return moreThanOneMatch[j];
                    }
                }
                return false;
            };
            for (var i=0; i<deadlength; i++) {
                var it = extractNumber(deadwood[i]);
                var existingMatch = compareIt(it);
                if(existingMatch) {
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
        
        var canWeAddtoKeepTheseOnes = function () {
                var arr = [];
                var valueOrFalse = null;
                var comparison = function (prop, numb) {
                    for(var j=0; j<deadlength; j++) {
                      var sliceString = extractString(deadwood[j]);                     
                      var getNum = extractNumber(deadwood[j]);
                      if (sliceString == prop) {
                         if (getNum == (numb-1 ) || getNum == (numb+1))
                         return deadwood[j];
                      }
                    }
                    return false;
                };
                
                for (var prop in inARow) {
                    for (var i=0; i<inARow[prop].length; i++) {
                       valueOrFalse = comparison(prop,inARow[prop][i]);
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
        if ((addToExistingMatch && !!joshua) || (addOnToInARow && !!joshua) ) {
            matches = true;
            //do some dom manipulation give user hin by animating card or something if they click then deduct points off score
        } 
        
        if (addToExistingMatch && !joshua || addOnToInARow && !joshua ) { // player knocked first
            matches = true;
            console.log(addToExistingMatch); //fix this
            // no hints needed just do some animation and have joshua slide his card over to main deck maybe
        }
        
        if (!!matches) {
            return {
                johsua:joshua,
                match:addToExistingMatch || [],
                inaRow: addOnToInARow || []
            };
            
        } else {
            return matches; // false
        }
        
        
    },
    
    addOnYourDeadwoodToOpponet: function (arr, str, player) {
        var that = this;
        var num = null;
        var numArray = [];
        var extractNumber = function (deadString) {
                return parseInt(deadString.match(/\d+/));
        };
        var extractString = function (strWithNum) {
            var strIndex = strWithNum.indexOf(" ");
            return strWithNum.slice(0, strIndex);
        };
        if (str == 'match') {           
            arr.forEach(function(val) {
               num = extractNumber(val);
               var string = that.cardArray[num - 1];
               if (player === 'findFirstPlayerScore') {
                   that.$area.find('.'+string).parent().addClass('zooom');
               } else {
                   $('section.leftovers').eq(0).find('.'+string).parent().addClass('zooom');
               }
               numArray.push(num);
            }); 
            return numArray;
        } else {
            arr.forEach(function(val) {
               num = extractNumber(val);
               var numString = "."+ that.cardArray[num - 1];
               var suit = "." + extractString(val);
               var together = suit + numString;
                if (player === 'findFirstPlayerScore') {
                    that.$area.find(together).parent().addClass('zooom');
                } else {
                    $('section.leftovers').eq(0).find(together).parent().addClass('zooom'); 
                }

               numArray.push(num);
            });
            
            return numArray;
        }
    },
    
    loopThroughWhatToMinus: function (arr1, arr2) {
        var array = arr1.concat(arr2);
        var numToReturn = 0;
        array.forEach(function(val) {
           var value = (val > 10) ? 10 : val;
           numToReturn += value;
        });
        
        return numToReturn;
    },
    


    overlay: function (howsitgonnabe) { //fix this function
        console.log('overlay called');
        var $overlay = $('div.overlay'),
            $closeBttn = $overlay.find('button.overlay-close'),
            that = this,
            game_over = document.getElementById('game_over'),
            score = (howsitgonnabe) ? howsitgonnabe.score : null,
            startNewGame = function () {
                var $trigger = $('#trigger-overlay');
                $trigger.empty().addClass('newGAME bubble').text("Start New Match");
                $trigger.on('click', function (e) {
                   e.preventDefault();
                   window.location.reload(); // FIX THIS
                });
            },
            toggleOverlay = function (e) {
                (e) ? (e.target) ? e.preventDefault() : '' : '';
                console.log(e);
                if ($overlay.hasClass('open')) {
                    $overlay.removeClass('open');
                    $overlay.addClass('close');
                    var onEndTransitionFn = function () {
                        $overlay.removeClass('close');
                    };
                    $overlay.on(transitionEndEvent, onEndTransitionFn);
                    $(game_over).fadeOut();
                    $('#intro').remove();
                    console.log('open');
                } else if (!($overlay.hasClass('close'))) {
                    $overlay.addClass('open');
                    console.log('close');
                    if (e) {
                        if (e.heading && e.total < 100) {
                            $('#intro').hide();
                            $(game_over).fadeIn();
                            game_over.querySelector('h1').innerHTML = howsitgonnabe.heading;
                            game_over.querySelector('h2').innerHTML = howsitgonnabe.text;
                        }
                        
                        if (e.heading && e.total >= 100) { //END OF GAME NOT MATCH
                            $(game_over).fadeIn();
                            if (howsitgonnabe.win === "You") {
                                game_over.querySelector('h1').innerHTML = "Congratualations You won the game but I'll get you next time, Gadget! NEXT time!";
                                game_over.querySelector('h2').innerHTML = "You scored a total of " + howsitgonnabe.total + " points";
                                that.congratulations(true);
                            } else { //joshua won
                                game_over.querySelector('h1').innerHTML = "Joshua and O'Doyle Rules - GAME OVER!";
                                game_over.querySelector('h2').innerHTML = "Joshua scored a total of " + howsitgonnabe.total + " points";
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
                        if (e.data.score) { //END OF Match
                           [].slice.call(document.querySelectorAll('button')).forEach(function (obj) {
                                if (obj.classList.contains('overlay-close')) {
                                    obj.disabled = false;
                                } else {
                                    obj.disabled = true;
                                }
                           });
                           rummy.$htmlDeck.children(':last-child').find('div').children('a.take').hide();
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

        $closeBttn.off('click').on('click', {
            score: score
        }, toggleOverlay);

        if (window.localStorage.getItem('modal') !== "falsy") {
            this.$intoIframe.insertBefore($(game_over));
            toggleOverlay();
            window.setTimeout(function () {
                document.getElementById('shallWePlayAGame').play();
            }, 2000);
        }

        window.localStorage.setItem('modal', "falsy");
        //window.localStorage.clear(); //for testing purposes
    },
    
    congratulations: function (player) {
        if (player ) {
           //do some celebration animation 
        } else {
            // do something else
        }
        
        window.localStorage.removeItem('You');
        window.localStorage.removeItem('Joshua');
    },

    updateScore: function (obj) {
        var whoWon = obj.win;
        var whoLost = (obj.win === "You") ? "Joshua" : "You";
        var you = document.getElementById('you');
        var joshua = document.getElementById("joshua");
        var yourChildren = you.querySelector('div').children;
        var joshuaChildren = joshua.querySelector('div').children;
        var span = document.createElement('span');
        var winnerObj = {};
        var loserObj = {};
        var overHundred = false;

        var updateSpan = function () {
            span.innerHTML = obj.score;
        };
        
        var loopThroughSpans = function (spans) {
            var arr = [];
            var total = 0;
            for (var i=0; i<spans.length; i++) {
                var num = parseInt(spans[i].textContent);
                arr.push(num);
                total += num;
            }
            overHundred = (total >= 100) ? true : false;
            return {
                arr:arr,
                total:total,
                overOneHundred:overHundred
            };
        };
        if (whoWon === "You") { // refactor this
                updateSpan();
                you.querySelector('div').appendChild(span);
                winnerObj = loopThroughSpans(yourChildren);
                loserObj = loopThroughSpans(joshuaChildren);
                you.querySelector('h6').innerHTML = winnerObj.total;
        } else { //duh computer
                updateSpan();
                joshua.querySelector('div').appendChild(span);
                winnerObj = loopThroughSpans(joshuaChildren);
                loserObj = loopThroughSpans(yourChildren);
                joshua.querySelector('h6').innerHTML = winnerObj.total;
        }
        
        if (winnerObj.overOneHundred) {
            $('#score').nextUntil('div.overlay').remove();
            
        } 
        
        window.localStorage.setItem(whoWon, winnerObj.arr );
        window.localStorage.setItem(whoLost, loserObj.arr );
        document.getElementById('score').style.display = "block";
    },
    
    checkLocalStorage: function () {
        var createSpans = function(arr, id) {
            var total = 0;
            arr.forEach(function(val, i, array) {
                var span = document.createElement('span');
                span.innerHTML = val;
                id.querySelector('div').appendChild(span);
                total += parseInt(val);
            });
                id.querySelector('h6').innerHTML = total;
            
        };
        if (window.localStorage.getItem('You') || window.localStorage.getItem('Joshua')) {
            document.getElementById('score').style.display = "block";
            if (window.localStorage.getItem('You')) {
                 var you = window.localStorage.getItem('You').split(',');
                 createSpans(you, document.getElementById('you'));
                 //loop through  you and crate spans for each one append to you div
            }
            if (window.localStorage.getItem('Joshua')) {
                var joshua = window.localStorage.getItem('Joshua').split(',');
                createSpans(joshua, document.getElementById("joshua"));
            }
        } 
    },

    helpfulHints: function (param) {
        $('div.bubble').addClass('hide');
        if (typeof param === 'undefined') return false;
        var secondString = 'Sort your cards by either suit or match. Drag each card with your mouse. When you are done sorting, either take the top card from the discard pile or click take from deck button';
        var thirdString = "Before you discard any of your cards you have the option to knock (end the game) - Any remaining cards that are not part of a valid combination are considered deadwood, \n\
                              the total value of your deadwood should be ten points or less or you will be alerted that you are unable to knock if you are able to knock your point total will be compared to Joshuas(the computer) too see if you won or lost";
        var $html = null;
        if (param === 'first') {
            $html = $('<div class="first_bubble bubble">Click below to start game</div>');
            $html.appendTo('#main_content');
        }

        if (param === 'second') {
            $html = $('<div class="second_bubble bubble">' + secondString + '</div>');
            $html.appendTo('body');
            window.setTimeout(function () {
                $html.addClass('animated');
            }, 1000);
        }

        if (param === "third") {
            $html = $('<div class="third_bubble bubble">' + thirdString + '</div>');
            $html.appendTo('body');
            window.setTimeout(function () {
                $html.addClass('animated');
            }, 1000);
        }
    }

};

var rummy = Object.create(RUMMY.prototype);
rummy.cardArray = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
rummy.each_suit = ['spades', 'clubs', 'hearts', 'diamonds'];
rummy.one_suit = {};
rummy.cardValues = {};
rummy.cardArray.forEach(function (val, index) {
    ++index;
    this.one_suit[val] = (index > 9) ? 10 : index;
    this.cardValues[val] = index;
}, rummy); 
rummy.takeCard = "take";
rummy.discardString = "discard";
rummy.playHoverCalled = false;
rummy.deckofcards = (function (obj) {
    var deck = {},
        i,
        len;
    for (i = 0, len = obj.each_suit.length; i < len; i++) {
        deck[obj.each_suit[i]] = Object.create(obj.one_suit);
    }
    return deck;
}(rummy || {}));
rummy.whole_deck = [];
rummy.$htmlDeck = null;
rummy.$bubble = null;
rummy.$area = $('#area');
rummy.$comp_area = $('#comp_area');
rummy.iframeptext = "You will be playing the computer (aka Joshua), with each hand you the player will always go first. Whomever reaches 100 points first will be crowned winner of the game. Below are instructions to the game, you should only see this intro screen once.";
rummy.iframeh1text = "WELCOME TO GIN RUMMY";
rummy.$intoIframe = $('<section id="intro"><h1>'+rummy.iframeh1text+'</h1><p>'+rummy.iframeptext+'</p><audio id="shallWePlayAGame" controls="controls"><source src="playgame.wav" type="audio/wav" /></audio><iframe width="1000" height="600" src="http://www.pagat.com/rummy/ginrummy.html"></iframe></section>');


var oneTimeEvents = Object.create(rummy);
oneTimeEvents.createarrayofcards = function (callcreatehtmldeck) {
    var second_key = '',
        suit_object = '',
        key;
    for (key in this.deckofcards) {
        suit_object = this.deckofcards[key]; // {hearts, diamonds, clubs, spades }
        var suit = suit_object;
        for (second_key in suit) { //second_key is ace, two, three, etc    
            if (!callcreatehtmldeck) this.whole_deck.push(second_key + ' of ' + key + ' ' + suit[second_key]); //e.g ace of hearts 1
        }
    }
    this.whole_deck = this.whole_deck.shuffle(); //shuffling the deck
    if (callcreatehtmldeck) {
        this.fillinmaincontent();
        this.loopthroughdiv();
        this.dealcards();
    }
};

oneTimeEvents.fillinmaincontent = function () {
    var main_content = document.getElementById('main_content');
    var buttons = '<article><button id="deal">dealcards</button> <button disabled id="reshuffle">reshuffle</button><button id="takeCard" class="hide">Take from deck</button> <button id="knock" class="hide">Knock</button> </article>';
    main_content.innerHTML = this.createhtmlDeck(this.whole_deck) + buttons; // creates the deck
    rummy.$htmlDeck = $('#deck');
    this.helpfulHints('first');
};

oneTimeEvents.createhtmlDeck = function (wholeDeck) {
    var html = '<section id="deck">';
    var wholedecklength = wholeDeck.length,
        i,
        suit;
    for (i = 0; i < wholedecklength; i++) {
        suit = this.whole_deck[i].split(' ')[2];
        html += '<section class="wrapper"><div class=' + suit + '>' + wholeDeck[i] + '</div><div class="back"></div></section>';
    }
    html += '</section>';
    return html;
};

oneTimeEvents.loopthroughdiv = function () {
    var that = this;
    var html_text;
    var html_text_num;
    this.$htmlDeck.find('div').not('.back').each(function (i) {
        var $this = $(this);
        html_text = $this.text();
        html_text_num = html_text.substr(html_text.length - 2);
        var space = html_text.split(" ");
        $this.attr('data-value', $.trim(html_text_num)).addClass(space[0]);
        $this.parent().css({
            top: 1 + i,
            left: 1 + i,
            zIndex: 1 + i
        });
        $this.html(function () {
            var last = space.pop();
            var new_html = "<p>" + space.join(" ") + "</p><a href='#'>" + that.discardString + "</a><span>" + last + "</span>";
            return new_html;
        });
    });
};

oneTimeEvents.dealcards = function () {
    var that = this;
    var deal = document.getElementById('deal');
    var $deck = this.$htmlDeck;
    var $doItforTheChildren = $deck.children();
    deal.addEventListener('click', function () {
        var k = 1;
        var i = 52;
        that.helpfulHints();
        this.className += ' hide';
        var x = [];
        //check these values on second call of deal cards  and k as well console log those 
        var refreshIntervalId = window.setInterval(function () {
            if (i % 2 === 1) {
                x.push($doItforTheChildren.eq(i));
                $doItforTheChildren.eq(i).addClass('player').css({
                    '-webkit-transform': 'translateX(' + (k - 50) + 'px)',
                    'transform': 'translateX(' + (k - 50) + 'px)',
                    'zIndex': k + 2
                }).removeStyle('top'); //.removeStyle('z-index') // player one
            } else {
                $doItforTheChildren.eq(i).addClass('comp_player').css({
                    left: k - 50,
                    'top': '-185px'
                }); // computer player
            }
            k = 50 + k;
            i = i - 1;
            if (i < 32) { //10 cards each 52-32         
                that.flipNewDeck('player', $deck.find('.player'));
                that.flipNewDeck('comp', $deck.find('.comp_player'));
                window.clearInterval(refreshIntervalId);
            }
        }, 250); // end setInterval	
    }, false);
};

oneTimeEvents.flipNewDeck = function (whichPlayer, $object) {
    var that = this;
    var iterator = 0;
    if (whichPlayer === 'player') {
            var left = $object.parent().offset().left;
            $('#player').css({
                position: 'relative',
                top: '-185px',
                marginLeft: (left)
            });
            window.setTimeout(function () {
                var obj = $object.get().reverse();
                $object.addClass('flipchild').children('div').addClass('flip').one(transitionEndEvent, function (event) {
                    iterator++;
                    $(obj).appendTo(that.$area).removeAttr('style');
                    if (iterator == $(this).length) {
                        that.switchitupyo($object);
                    }
                });
            }, 3000);
    } else { //it's computer player
        $object.removeClass('temp');
        window.setTimeout(function () {
            var top_pos = $object.position().top;
            top_pos = top_pos - 15; // because of min-height on main content div
            var left = $object.parent().offset().left;
            $('#comp_player').css({
                position: 'relative',
                top: -top_pos,
                marginLeft: (left)
            });
            $object.appendTo(that.$comp_area);
        }, 4000);
    }
};

oneTimeEvents.switchitupyo = function () {
    this.$area.sortable({
        axis: "x",
        cursor: "move"
    });
    $('#reshuffle').removeAttr('disabled');
    this.reshuffle();
    this.dealfirstcard();
};

oneTimeEvents.dealfirstcard = function () {
    var $deck = this.$htmlDeck;
    var deck = $deck[0]; // get last child fix this 3/29
    var deckLastChild = deck.lastElementChild;
    var that = this;
    var $takeCard = $('#takeCard');
    var $deckLastChild = $(deckLastChild);
    $deckLastChild.removeStyle('left').addClass('showdacard delt').on(transitionEndEvent, function () {
        $(this).addClass('flipit').children('div').addClass('flipit taketopCard ').on(transitionEndEvent, function () {
            $takeCard.removeClass('hide').next().removeClass('hide').attr('disabled', true);
            $(this).find('a').text(that.takeCard).addClass('take');
        });
    });
    player.takeCardEvent($deck, $takeCard, $deckLastChild);
    player.knock(document.getElementById('knock'));
    this.helpfulHints('second');
};

oneTimeEvents.reshuffle = function () {
    var reshuffle = document.getElementById('reshuffle');
    var that = this;
    reshuffle.addEventListener('click', function () {
        $('#comp_area, #area').empty();
        $('#main_content').empty();
        that.createarrayofcards(true);
    }, false);
};


var player = Object.create(rummy);
player.legitimateKnock = false;
player.knocked = false;
player.playHoverCalled = false;
player.firstPersonScore = null;
player.deck = null;

//this function only gets invoked once but registers the event listeners 
player.takeCardEvent = function ($deck, $takefromdeckbutton) {
    var that = this,
        flag = true,
        removeHelpfulHints = function () {
            that.helpfulHints('third');
        };

        $takefromdeckbutton.on('click', function () {
            this.disabled = true;
            this.nextElementSibling.disabled = false;
            var $topFromDeck = $deck.find('.delt:first').prev() || $deck.find(':last-child').prev();
            $topFromDeck.addClass('player temp speedUpAnimation').css({
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
        });


        $deck.on('click', 'a.take', function (event) {
            var takebutton = $takefromdeckbutton.get(0);
            takebutton.disabled = true;
            takebutton.nextElementSibling.disabled = false;
            $(this).removeClass('take').text(that.discardString);
            var $parent = $(this).parents('section.wrapper');
            that.flipCards('top_card', $parent);
            if (flag) removeHelpfulHints();
            flag = false;
            event.preventDefault();
        });

};

player.knock = function (knockButton) {
    var that = this;
    knockButton.addEventListener('click', function (event) {
        window.alert('please choose one last card to discard');
        that.knocked = true;
        this.disabled = true;
    }, false);
};

player.flipCards = function (which_one, $object) {
    var that = this;
    if (which_one === "new_card") {
        $object.addClass('flipchild').children('div').addClass('flip').one(transitionEndEvent, function () {
            $object.removeClass('temp').prependTo(that.$area).removeAttr('style');
            that.playerHover($object, 'one');
        });
    }

    if (which_one === "top_card") {
        var currentCard = $object.offset().left;
        var currentDeck = this.$area.find('section:first-child').offset().left;
        var whereToGo = (currentDeck - currentCard) - 50;
        whereToGo = ($object.hasClass('showdacard')) ? -49 : whereToGo;
        $object.removeStyle('top').addClass('player temp speedUpAnimation').css({
           // '-webkit-transform': 'translateX(' + whereToGo + 'px)',
            'transform': 'translateX(' + whereToGo + 'px)'
        })
            .one(transitionEndEvent, function () {
                $object.removeClass('showdacard flipit temp').addClass('flipchild').prependTo(that.$area).removeAttr('style');
                that.playerHover($object, 'one');
            });

    }
};


player.playerHover = function (obj) {
    var $objPlusSiblings = obj.siblings().addBack();
    if ($objPlusSiblings.length > 10) {
        $objPlusSiblings.find('a').addClass('discard');
    } else {
        $objPlusSiblings.find('a').removeClass('discard');
    }
    if (!this.playHoverCalled) {
        var $playerArea = obj.parent();
        this.preDiscard($playerArea);
        this.playHoverCalled = true;
    }
};

//method only called once but registers an event that's called many times
player.preDiscard = function ($container) {
    var that = this;
    $container.on('click', 'a.discard', function (event) {
        var $section = $(this).parents('section.player');
        that.discard($(this), $section);
        that.helpfulHints();
        event.preventDefault();
    });
};





var compPlayer = Object.create(rummy);
compPlayer.parentInfoObj = {};
compPlayer.score = null;
compPlayer.deck = null;
compPlayer.index = 0;
compPlayer.lastInDeck = null;

compPlayer.takeNextCard = function () {
    var that = this;
    var $deck = this.$htmlDeck;
    var $compArea = this.$comp_area;
    this.$comp_player = $('#comp_player');
    var lastInHandLeftPos = this.lastCardPos = parseInt($compArea.children(':first-child').css('left'));
    if (this.index === 1) {this.lastInDeck = lastInHandLeftPos; }
    var pos = this.parentInfoObj.left || lastInHandLeftPos + 50 + 'px';
    var zIndex = this.parentInfoObj.zIndex || 25;
    var $lastInDeck = $deck.find('.delt:first').prev();
    var $topCardShown = $deck.children(':last');
    var takeTopCard = this.preFilteringOfCreateArray($compArea.children(), 'topCard');
    var $element = (!!takeTopCard) ? $topCardShown : $lastInDeck;
    $element.removeClass('flipchild player speedUpAnimation').addClass('comp_player temp').css({
        'left': pos,
        'top': '-185px',
        'zIndex': zIndex
    }).one(transitionEndEvent, function () {
        $(this).prependTo($compArea).removeClass('flipchild');
        var $selfAndSiblings = $(this).siblings().andSelf();
        that.preFilteringOfCreateArray($selfAndSiblings);
    });
};




//Bottom of Page
oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();


//events
oneTimeEvents.dealcards();
oneTimeEvents.reshuffle();
rummy.overlay(); 
rummy.checkLocalStorage();