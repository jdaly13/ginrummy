// NEED TO MOVE THIS PART SOMEWHERE ELSE maybe a file called dependecies 
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
        var that = this;
        $discard.removeClass('discard');
        var $siblings = $obj.siblings();
        $siblings.find('a').removeClass('discard').parent().removeClass('taketopCard');
        var $lastChild = $('#deck').children(':last-child');
        var lastChildPosition = $lastChild.position().left;
        var lastChildzIndex = parseInt($lastChild.css('z-index'));
        if ($lastChild.hasClass('showdacard') || $lastChild.hasClass('player') || $lastChild.hasClass('comp_player')) {
            $obj.appendTo('#deck').css({
                'z-index': lastChildzIndex + 1,
                "left": lastChildPosition + 23,
                "top": '32px'
            }).addClass('delt');
        } else {
            $obj.appendTo('#deck').css({
                'z-index': lastChildzIndex + 1,
                "left": '200px',
                "top": '32px'
            }).addClass('delt');
        }
        if (!!player.knocked) {
            this.preFilteringOfCreateArray($('#area').children(), 'firstPlayer');
            player.knocked = false;
            if (!!player.legitimateKnock) {
                this.preFilteringOfCreateArray($('#comp_area').children(), 'computer');
                return false;
            }
        }

        if (!!arguments[3]) {
            this.preFilteringOfCreateArray($('#area').children(), 'findFirstPlayerScore');
            return false;
        }
        if (arguments[2] !== 'donotrun') {
            setTimeout(function () {
                compPlayer.takeNextCard();
            }, 1000);
        }


    },

    preFilteringOfCreateArray: function ($obj, player) {
        var suitNCardArray = [];
        var computerDeck = [];
        $obj.children(':first-child').each(function (i, element) {
            var suit_card_n_value = $(this).attr('class');
            var value = suit_card_n_value.slice(suit_card_n_value.indexOf(' ') + 1, suit_card_n_value.length);
            computerDeck.push(value);
            suitNCardArray.push(suit_card_n_value);
        });

        var topCard = this.startTheProcess(suitNCardArray, player);
        return (!!topCard) ? true : false;

    },

    startTheProcess: function (withSuit, playerOne) {
        var that = this;
        var computerKnock = false; //has the computer knocked
        var objectsGalore = {}; //object of ojbects with each hand
        var total = 0; // total before discarding last card
        var whatCardToRidThisTime = null;
        var valueOfCard = null;
        var stringToDiscard = null;
        var finalTotal = null;
        var computerScore = 0;
        var finalScore = 0;
        var $frontSideOfCardToBeDiscarded = null;
        var $cardToBeDiscarded = null;

        var createObjectsGalore = function () {
            var arrOfArrays = that.makeArrayofArrays(withSuit); // returns [["clubs", "two"], ["spades", "two"], ["clubs", "ten"], etc]
            var filterOutArrayOfArraysObj = that.furtherFilter(arrOfArrays); //returns obj { clubs: ["six"], diamonds: ["three", "ace", "four"], hearts: ["ten", "queen"], etc }
            var anotherObj = that.originalFilter(filterOutArrayOfArraysObj); // returns obj { clubs: [6], diamonds: [3, 1, 4], hearts: [10, 12], etc }
            var sortedObjects = that.decideWhichOnesToKeep(anotherObj);
            // filtering suits/numbers in order returns object with objects of arrays { keepTheseOnes:{ clubs: [1], diamonds:[]} maybes: {}, possibleDiscard etc}
            var objectsGalore = that.findMatches(sortedObjects); // adds to properties to the object
            return objectsGalore;
        }

        objectsGalore = createObjectsGalore();
        console.log(objectsGalore);


        if (playerOne === 'topCard') { //does computer player take top Card
            return this.doWeTakeTopCard(this.$htmlDeck, objectsGalore);
        }

        total = this.checkScore(objectsGalore);
        if (playerOne === 'firstPlayer') {
            if (total <= 10) {
                player.legitimateKnock = true;
                player.firstPersonScore = total;
            } else {
                alert("you don't have enough to knock");
            }
            return false;
        }

        if (playerOne === 'findFirstPlayerScore') {
            finalScore = total - computerScore;
            // finalScore > 0 ? alert('the computer wins, they score ' + finalScore) : alert('you win and scored ' + Math.abs(finalScore) + 10);
            finalScore > 0 ? this.makeLoveNotTupperWar(finalScore, playerOne, false) : this.makeLoveNotTupperWar(finalScore, playerOne, true);
            return false;
        }

        whatCardToRidThisTime = this.shitPile(objectsGalore.possibleDiscard, objectsGalore.maybes, objectsGalore.oneMatch);
        valueOfCard = this.checkTheValueof(whatCardToRidThisTime, objectsGalore);
        if (valueOfCard) whatCardToRidThisTime = valueOfCard;
        if (typeof whatCardToRidThisTime === 'number') {
            finalTotal = total - whatCardToRidThisTime;
            stringToDiscard = "." + this.cardArray[whatCardToRidThisTime - 1];
        } else {
            finalTotal = total - ((whatCardToRidThisTime[1] > 10) ? 10 : whatCardToRidThisTime[1]);
            whatCardToRidThisTime[1] = '.' + this.cardArray[whatCardToRidThisTime[1] - 1];
            console.log(whatCardToRidThisTime);
            stringToDiscard = whatCardToRidThisTime.join(''); //FIX THIS!!!!
        }

        if (finalTotal < 10 && playerOne !== 'computer') {
            //alert('computer player');
            computerKnock = true;
            computerScore = finalTotal;
        }

        if (playerOne === 'computer') {
            computerScore = total;
            console.log(computerScore);
            console.log(player.firstPersonScore);
            finalScore = computerScore - player.firstPersonScore;
            //finalScore > 0 ? alert('you win your score is ' + finalScore) : alert('you lost the computer scored ' + Math.abs(finalScore) + 10);
            finalScore > 0 ? this.makeLoveNotTupperWar(finalScore, playerOne, true) : this.makeLoveNotTupperWar(finalScore, playerOne, false);
            return false;
        }

        $frontSideOfCardToBeDiscarded = this.findCardtoDiscard(stringToDiscard);
        $cardToBeDiscarded = $frontSideOfCardToBeDiscarded.parent();
        compPlayer.parentInfoObj = this.getStyles($cardToBeDiscarded);
        $frontSideOfCardToBeDiscarded.addClass('taketopCard').find('a').text(this.takeCard).addClass('take');
        $cardToBeDiscarded.addClass('flipit');
        this.discard($frontSideOfCardToBeDiscarded, $cardToBeDiscarded, 'donotrun', computerKnock);
        $('#takeCard').removeAttr('disabled').next('#knock').attr('disabled', true);



    },

    makeArrayofArrays: function (array) {
        var length;
        var another = [];
        var i;
        var cardFace = [];
        var compDeck = array;
        for (i = 0, length = compDeck.length; i < length; i++) {
            another = compDeck[i].split(' ');
            compDeck[i] = another;
            for (var j = 0; j < compDeck[i].length; j++) {
                if (j === 1) {
                    cardFace.push(compDeck[i][j]);
                }
            }
        }

        return compDeck;
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
        // var makeComparisionArray = $topCardContainer.find(':first-child').attr('class').split(' ');
        //this.checkTheValueof(dataValue, obj);
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


        }

        return topCardComparison(paleBlueEyes, dataValue);

    },

    findCardtoDiscard: function (eleClass) {
        return $('#comp_area').find(eleClass).first().addClass('discard');
    },

    furtherFilter: function (arr) {
        var spades = [],
            hearts = [],
            diamonds = [],
            clubs = [],
            i,
            j,
            obj = {};
        for (i = 0; i < arr.length; i++) {
            for (j = 0; j < arr.length; j++) {
                if (arr[j][0] === "spades") {
                    spades.push(arr[j][1]);
                }
                if (arr[j][0] === "hearts") {
                    hearts.push(arr[j][1]);
                }
                if (arr[j][0] === "diamonds") {
                    diamonds.push(arr[j][1]);
                }
                if (arr[j][0] === "clubs") {
                    clubs.push(arr[j][1]);
                }
            }
            break;
        }

        obj.spades = spades || null;
        obj.hearts = hearts || null;
        obj.diamonds = diamonds || null;
        obj.clubs = clubs || null;

        //this.originalFilter(obj);
        return obj;
    },

    originalFilter: function (object) {
        var prop;
        var i;
        var clubs = [];
        var spades = [];
        var diamonds = [];
        var hearts = [];
        var obj = {};
        var that = this;

        for (prop in object) {
            for (i = 0; i < object[prop].length; i++) {
                var data = testFunction(object[prop][i]);
                if (prop === 'clubs') {
                    clubs[i] = data;
                }

                if (prop === 'spades') {
                    spades[i] = data;
                }

                if (prop === 'diamonds') {
                    diamonds[i] = data;
                }

                if (prop === 'hearts') {
                    hearts[i] = data;
                }
            }
        }

        function loopEm() {
            for (var j = 0; j < arguments.length; j++) {
                for (var k = 0; k < arguments[j].length; k++) {
                    if (arguments[j].length >= 1) {
                        arguments[j].sort(function (a, b) {
                            return a - b;
                        });
                    }
                }
            }

            obj.clubs = arguments[0];
            obj.spades = arguments[1];
            obj.diamonds = arguments[2];
            obj.hearts = arguments[3];

            return obj;
        }

        function testFunction(value) {
            return getValues(value);
        }


        function getValues(string) {
            var prop;
            for (prop in that.cardValues) {
                if (prop == string) {
                    return that.cardValues[prop];
                }
            }

        }

        return loopEm(clubs, spades, diamonds, hearts);

        //this.decideWhichOnesToKeep(loopEm(clubs, spades, diamonds, hearts))
    },

    decideWhichOnesToKeep: function (obj) {
        var keepTheseOnes = {};
        var maybes = {};
        var possibleDiscard = {};

        for (var prop in obj) {
            keepTheseOnes[prop] = [];
            maybes[prop] = [];
            possibleDiscard[prop] = [];
            for (var i = 0; i < obj[prop].length; i++) {
                if ((obj[prop][i + 1] === obj[prop][i] + 1) && (obj[prop][i + 2] === obj[prop][i] + 2) && (obj[prop][i + 3] === obj[prop][i] + 3) && (obj[prop][i + 4] === obj[prop][i] + 4) && (obj[prop][i + 5] === obj[prop][i] + 5)) {
                    keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] + 1, obj[prop][i] + 2, obj[prop][i] + 3, obj[prop][i] + 4, obj[prop][i] + 5);
                    i = i + 5;
                } else if ((obj[prop][i + 1] === obj[prop][i] + 1) && (obj[prop][i + 2] === obj[prop][i] + 2) && (obj[prop][i + 3] === obj[prop][i] + 3) && (obj[prop][i + 4] === obj[prop][i] + 4)) {
                    keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] + 1, obj[prop][i] + 2, obj[prop][i] + 3, obj[prop][i] + 4);
                    i = i + 4;
                } else if ((obj[prop][i + 1] === obj[prop][i] + 1) && (obj[prop][i + 2] === obj[prop][i] + 2) && (obj[prop][i + 3] === obj[prop][i] + 3)) {
                    keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] + 1, obj[prop][i] + 2, obj[prop][i] + 3);
                    i = i + 3;
                } else if ((obj[prop][i + 1] === obj[prop][i] + 1) && (obj[prop][i + 2] === obj[prop][i] + 2)) {
                    keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] + 1, obj[prop][i] + 2);
                    i = i + 2;
                } else if ((obj[prop][i + 1] === obj[prop][i] + 1) && obj[prop][i + 1] < 7) {
                    maybes[prop].push(obj[prop][i], obj[prop][i] + 1);
                    i++;
                } else {
                    possibleDiscard[prop][i] = obj[prop][i];
                }
            }
        }

        function removeUndefineds(obj) {
            var otherObj = {};
            for (var prop in obj) {
                otherObj[prop] = obj[prop].filter(function (n) {
                    return n !== undefined;
                });
            }

            return otherObj;
        }

        return {
            keepTheseOnes: keepTheseOnes,
            maybes: maybes,
            possibleDiscard: removeUndefineds(possibleDiscard)
        };

    },

    shitPile: function (discardObj, maybeObj) {
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
                if (Array.isArray(arr)) return arr
            }

            if (num === 4) {
                arr = looping(9, 1);
                if (Array.isArray(arr)) return arr
            }

            if (num === 9) {
                arr = looping(3, 1);
                if (Array.isArray(arr)) return arr
            }
        }

        arr = looping(8, i);
        return arr || 'shitdick';


    },

    findMatches: function (objOfObjects) {
        var properties = this.each_suit;
        var propertyLength = properties.length;
        var testArray = [];
        var keepArray = [];
        var analyzeKeepTheseOnes = function (j) {
            var i = 0,
                first,
                last;
            for (i; i < propertyLength; i++) {
                if (objOfObjects[j][properties[i]].length > 3) {
                    first = objOfObjects[j][properties[i]][0];
                    last = objOfObjects[j][properties[i]][objOfObjects[j][properties[i]].length - 1];
                    keepArray.push(first, last);
                }
            }
        };


        for (var j in objOfObjects) {
            if (j === "keepTheseOnes") {
                analyzeKeepTheseOnes(j)
            } else {
                for (var k = 0; k < propertyLength; k++) {
                    for (var i = 0; i < objOfObjects[j][properties[k]].length; i++) {
                        testArray.push(objOfObjects[j][properties[k]][i]);
                    }
                }
            }
        }

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
            compareWithkeepArray();
            removeFromDiscard(objOfObjects.oneMatch, objOfObjects.moreThanOneMatch);
            return objOfObjects;
        } else {
            return objOfObjects;
        }


        function removeFromDiscard(arr1, arry2) {
            var arr = arr1.concat(arry2);
            var x = -1;

            function loop(j, discardOrMaybe) {
                for (var prop in objOfObjects[discardOrMaybe]) {
                    for (var i = 0; i < objOfObjects[discardOrMaybe][prop].length; i++)
                        if (arr[j] == objOfObjects[discardOrMaybe][prop][i]) {
                            objOfObjects[discardOrMaybe][prop].splice(i, 1);
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
                var endSecondLoop = loop(0, 'maybes');
            }

            if (endSecondLoop == "maybes") {
                loop(0, 'keepTheseOnes');
            }
        }


        function compareWithkeepArray() {
            var i = 0;
            var doeTheyMatch = function (num) {
                if (num === keepArray[0]) {
                    return keepArray[0]
                }

                if (num === keepArray[1]) {
                    return keepArray[1]
                }

                if (keepArray.length > 2) {
                    if (num === keepArray[3]) {
                        return keepArray[3]
                    }

                    if (num === keepArray[4]) {
                        return keepArray[4]
                    }
                }
            }
            while (i < objOfObjects.oneMatch.length) {
                var freshFeeling = doeTheyMatch(objOfObjects.oneMatch[i]);
                if (!!freshFeeling) {
                    objOfObjects.oneMatch.splice(i, 1);
                    objOfObjects.moreThanOneMatch.push(freshFeeling);
                    objOfObjects.moreThanOneMatch.sort();
                    return true;

                }
                i++
            }

        }

    },

    checkTheValueof: function (val, objectsGalore) {
        if (typeof val == 'string') {
            var didwegetMatch = this.checkOneMatch(objectsGalore.oneMatch, objectsGalore.keepTheseOnes);
            if (!!didwegetMatch) {
                objectsGalore = this.removeFromOneMatchAddToMoreThanOneMatch(objectsGalore, didwegetMatch)
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

            return foundMatch
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
            // if (first.length > 2 || last.length > 2) {
            //     return false;
            //}
            return compareToOneMatch(oneMatch);
        } else {
            return false;
        }
    },

    lookAtOneMatch: function (arr) {
        var i;
        var length = arr.length
        for (i = 0; i < length; i++) {
            if (arr[i] > 4) {
                return arr[i];
            }
        }
        return arr.sort()[arr.length - 1];
    },

    checkScore: function (obj) {
        var keys = Object.keys(obj);
        var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        var suitLength = suits.length;
        var keyLength = keys.length;
        var i = 0;
        var k = 0;
        var p = 0;
        var totalCountAll = [];
        var total;

        function addUpValues(arr) {
            var length = arr.length;
            var value = 0;
            var i = 0;
            for (i = 0; i < arr.length; i++) {
                value += arr[i]
            }

            return value;
        }

        for (i; i < keyLength; i++) {
            if (keys[i] !== "keepTheseOnes" && keys[i] !== "moreThanOneMatch") {
                if (Array.isArray(obj[keys[i]])) {
                    for (var j = 0; j < obj[keys[i]].length; j++) {
                        if (obj[keys[i]][j] > 10) {
                            totalCountAll.push(parseInt(10 * 2))
                        } else {
                            totalCountAll.push(parseInt((obj[keys[i]][j]) * 2))
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
        obj.heading = win ? "Congratulations You Won " : "Sorry you lost";
        obj.text = string === 'findFirstPlayerScore' ? 'Joshua Scored ' + score + ' points' : 'You Scored ' + score + ' points';
        obj.score = score;
        obj.win = win ? "You" : "Joshua";

        this.overlay(obj);
    },


    overlay: function (howsitgonnabe) {
        var $overlay = $('div.overlay'),
            $closeBttn = $overlay.find('button.overlay-close'),
            that = this,
            game_over = document.getElementById('game_over'),
            score = (howsitgonnabe) ? howsitgonnabe.score : null,
            toggleOverlay = function (e) {
                console.log(arguments[0]);
                (e) ? (e.target) ? e.preventDefault() : '' : '';
                if ($overlay.hasClass('open')) {
                    $overlay.removeClass('open');
                    $overlay.addClass('close');
                    var onEndTransitionFn = function () {
                        $overlay.removeClass('close');
                    };
                    $overlay.on(transitionEndEvent, onEndTransitionFn);
                    $('#intro').fadeOut().next().fadeOut();
                } else if (!($overlay.hasClass('close'))) {
                    $overlay.addClass('open');
                    if (e) {
                        if (e.heading) {
                            $('#intro').hide();
                            $(game_over).fadeIn();
                            game_over.querySelector('h1').innerHTML = howsitgonnabe.heading;
                            game_over.querySelector('h2').innerHTML = howsitgonnabe.text;
                        }
                    }
                } else {
                    $overlay.addClass('open');
                }

                if (e) {
                    if (e.data) {
                        if (e.data.score) that.updateScore(howsitgonnabe);
                    }

                }
            };


        if (howsitgonnabe) toggleOverlay(howsitgonnabe);

        //$triggerBttn.on( 'click', toggleOverlay );
        $closeBttn.off('click').on('click', {
            score: score
        }, toggleOverlay);

        if (window.localStorage.getItem('modal') !== "falsy") {
            toggleOverlay();
            setTimeout(function () {
                var audio = document.getElementById('shallWePlayAGame');
                audio.play();
            }, 2000);
        }

        window.localStorage.setItem('modal', "falsy");
        // window.localStorage.clear() //for testing purposes
    },

    updateScore: function (obj) {
        var whoWon = obj.win;
        var you = document.getElementById('you');
        var joshua = document.getElementById("joshua");
        var yourChildren = you.querySelector('div').children.length;
        var joshuaChildren = joshua.querySelector('div').children.length;
        var span = document.createElement('span');
        if (whoWon === "You") {
            if (yourChildren  == 0) {
                span.innerHTML = obj.score;
                you.appendChild(span);
            }
        } else { //duh computer
                if (joshuaChildren == 0)
                span.innerHTML = obj.score;
                joshua.appendChild(span);
        }
        
        document.getElementById('score').style.display = "block";
        


    },

    helpfulHints: function (param) {
        $('div.bubble').addClass('hide');
        if (typeof param === 'undefined') return false;
        var secondString = 'Sort your cards by either suit or match. Drag each card with your mouse. When you are done sorting, either take the top card from the discard pile or click take from deck button';
        var thirdString = "Before you discard any of your cards you have the option to knock (end the game) - Any remaining cards that are not part of a valid combination are considered deadwood, \n\
                              the total value of your deadwood should be ten points or less or you will be alerted that you are unable to knock if you are able to knock you point total will compared to Joshuas(the computer) too see if you won or lost"
        var $html = null;
        if (param === 'first') {
            $html = $('<div class="first_bubble bubble">Click below to start game</div>');
            $html.appendTo('#main_content');
        }

        if (param === 'second') {
            $html = $('<div class="second_bubble bubble">' + secondString + '</div>');
            $html.appendTo('body');
            setTimeout(function () {
                $html.addClass('animated')
            }, 1000);
        }

        if (param === "third") {
            $html = $('<div class="third_bubble bubble">' + thirdString + '</div>');
            $html.appendTo('body');
            setTimeout(function () {
                $html.addClass('animated')
            }, 1000);
        }
    }

};

var rummy = Object.create(RUMMY.prototype);
rummy.cardArray = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
rummy.each_suit = ['spades', 'clubs', 'hearts', 'diamonds'];
rummy.cardValues = {
    "ace": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "jack": 11,
    "queen": 12,
    "king": 13
};
rummy.one_suit = {
    ace: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 10,
    queen: 10,
    king: 10
};
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
    if (callcreatehtmldeck === true) {
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
    var eachSuit = this.each_suit = this.each_suit.shuffle(); //shuffle the deck
    var html = '<section id="deck">';
    var eachsuitlength = eachSuit.length;
    var wholedecklength = wholeDeck.length,
        i,
        j;
    for (i = 0; i < wholedecklength; i++) {
        for (j = 0; j < eachsuitlength; j++) {
            if (this.whole_deck[i].match(eachSuit[j])) {
                html += '<section class="wrapper"><div class=' + eachSuit[j] + '>' + wholeDeck[i] + '</div><div class="back"></div></section>';
            }
        } // end inner for loop
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
        //check these values on second call of deal cards  and k as well console log those bitches
        var refreshIntervalId = setInterval(function () {
            if (i % 2 === 1) {
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
                clearInterval(refreshIntervalId);
            }
        }, 300); // end setInterval	
    }, false);
};

oneTimeEvents.flipNewDeck = function (whichPlayer, $object) {
    var that = this;
    var iterator = 0;
    if (whichPlayer === 'player') {
        setTimeout(function () {
            var top_pos = $object.position().top;
            top_pos = top_pos; // because of min-height on main content div
            var left = $object.parent().offset().left;
            $('#player').css({
                position: 'relative',
                top: '-185px',
                marginLeft: (left)
            });
            setTimeout(function () {
                var obj = $object.get().reverse();
                $object.addClass('flipchild').children('div').addClass('flip').one(transitionEndEvent, function (event) {
                    iterator++;
                    $(obj).appendTo('#player #area').removeAttr('style');
                    if (iterator == $(this).length) {
                        that.switchitupyo($object);
                    }
                });
            }, 1000);
        }, 2000);
    } else { //it's computer player
        $object.removeClass('temp');
        setTimeout(function () {
            var top_pos = $object.position().top;
            top_pos = top_pos - 15; // because of min-height on main content div
            var left = $object.parent().offset().left;
            $('#comp_player').css({
                position: 'relative',
                top: -top_pos,
                marginLeft: (left)
            });
            $object.appendTo('#comp_player #comp_area');
        }, 4000);
    }
};

oneTimeEvents.switchitupyo = function () {
    var zindex = 52;
    zindex++;
    $("#area").sortable({
        axis: "x",
        cursor: "move"
    });
    $('#reshuffle').removeAttr('disabled');
    this.reshuffle();
    this.dealfirstcard();
};

oneTimeEvents.dealfirstcard = function () {
    var $deck = this.$htmlDeck;
    var deck = $deck.get(0); // get last child fix this 3/29
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

//this function only gets invoked once while the events below get invoked many times
player.takeCardEvent = function ($deck, $takefromdeckbutton, $lastChild) {
    var that = this,
        flag = true,
        removeHelpfulHints = function () {
            that.helpfulHints('third');
        };

    var takeFromDeck = (function () {
        $takefromdeckbutton.on('click', function (ev) {
            this.disabled = true;
            this.nextElementSibling.disabled = false;
            var $topFromDeck = $deck.find('.delt:first').prev() || $deck.find(':last-child').prev();
            $topFromDeck.addClass('player temp speedUpAnimation').css({
                '-webkit-transform': 'translateX(-50px)',
                'transform': 'translateX(-50px)'
            })
                .removeStyle('top')
                .one(transitionEndEvent, function (event) {
                    that.flipCards('new_card', $(this));
                    if (flag) removeHelpfulHints();
                    flag = false;
                });
        });
    }())


    var takeTopCard = (function () {
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
    }())

};

player.knock = function (knockButton) {
    var that = this;
    knockButton.addEventListener('click', function (event) {
        alert('please choose one last card to discard');
        that.knocked = true;
        this.disabled = true;
    }, false);
};

player.flipCards = function (which_one, $object) {
    var that = this;
    if (which_one === "new_card") {
        var flag = true;
        $object.addClass('flipchild').children('div').addClass('flip').one(transitionEndEvent, function () {
            $object.removeClass('temp').prependTo('#player #area').removeAttr('style');
            that.playerHover($object, 'one');
        });
    }

    if (which_one === "top_card") {
        var flag = true;
        var currentCard = $object.offset().left;
        var currentDeck = $('#area').find('section:first-child').offset().left;
        var whereToGo = (currentDeck - currentCard) - 50;
        whereToGo = ($object.hasClass('showdacard')) ? -49 : whereToGo;
        $object.removeStyle('top').addClass('player temp speedUpAnimation').css({
            '-webkit-transform': 'translateX(' + whereToGo + 'px)',
            'transform': 'translateX(' + whereToGo + 'px)'
        })
            .one(transitionEndEvent, function () {
                $object.removeClass('showdacard flipit temp').addClass('flipchild').prependTo('#area').removeAttr('style');
                that.playerHover($object, 'one');
            });

    }
};


player.playerHover = function (obj) {
    var $objPlusSiblings = obj.siblings().addBack();
    var howManyCards = obj.siblings().length;
    var that = this;
    if (howManyCards > 9) {
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

compPlayer.takeNextCard = function () {
    var that = this;
    var $deck = this.$htmlDeck;
    var lastInHandLeftPos = parseInt($('#comp_area').children(':first-child').css('left'));
    var pos = this.parentInfoObj.left || lastInHandLeftPos + 50 + 'px';
    var zIndex = this.parentInfoObj.zIndex || 25;
    var $lastInDeck = $deck.find('.delt:first').prev();
    var $topCardShown = $deck.children(':last');
    var takeTopCard = this.preFilteringOfCreateArray($('#comp_area').children(), 'topCard');
    var $element = (!!takeTopCard) ? $topCardShown : $lastInDeck;
    $element.removeClass('flipchild player speedUpAnimation').addClass('comp_player temp').css({
        'left': pos,
        'top': '-185px',
        'zIndex': zIndex
    }).one(transitionEndEvent, function () {
        $(this).prependTo('#comp_player #comp_area').removeClass('flipchild');
        var $selfAndSiblings = $(this).siblings().andSelf();
        that.preFilteringOfCreateArray($selfAndSiblings);
    });
}




//Bottom of Page
oneTimeEvents.createarrayofcards();
oneTimeEvents.fillinmaincontent();
oneTimeEvents.loopthroughdiv();


//events
oneTimeEvents.dealcards();
oneTimeEvents.reshuffle();
rummy.overlay(); /* IMPLEMENT LATER */