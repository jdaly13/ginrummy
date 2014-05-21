$.fn.removeStyle = function(style){
    var search = new RegExp(style + '[^;]+;?', 'g');
    return this.each(function(){
        $(this).attr('style', function(i, style){
            return style.replace(search, '');
        });
    }); 
};
Array.prototype.shuffle = function() {
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

        for ( ; i < l; i++ ) {
                t = vendors[i] + 'ransform';
                if ( t in dummyStyle ) {
                        return vendors[i].substr(0, vendors[i].length - 1);
                }
        }

        return false;
     })();
     
     if ( vendor === false ) return false;
        var transitionEnd = {
            '' : 'transitionend',
            'webkit' : 'webkitTransitionEnd',
            'Moz' : 'transitionend',
            'O' : 'oTransitionEnd',
            'ms': 'MSTransitionEnd'
        };

    return transitionEnd[vendor];
     
        
}());


var RUMMY = RUMMY || {};
RUMMY.one_suit = {
	ace:1, 
	two:2,
	three:3,
	four:4,
	five:5,
	six:6,
	seven:7,
	eight:8,
	nine:9,
	ten:10,
	jack:10,
	queen:10,
	king:10
};
RUMMY.cardValues = {
        "ace": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5,
	"six": 6,
	"seven": 7,
	"eight" : 8,
	"nine" : 9,
	"ten" : 10,
	"jack" : 11,
	"queen" : 12,
	"king" : 13
}

RUMMY.cardArray = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];

RUMMY.each_suit = ['spades', 'clubs', 'hearts', 'diamonds'];
RUMMY.takeCard = "take";
RUMMY.discard = "discard";
RUMMY.playHoverCalled = false;
RUMMY.deckofcards = (function (obj) {
    var deck = {},
        i,
        len;
    for (i=0, len = obj.each_suit.length; i < len; i++) {
	deck[obj.each_suit[i]] = Object.create(obj.one_suit);
    }
    return deck;
}(RUMMY || {})); // returns object

RUMMY.computerPlayer = {};
RUMMY.computerPlayer.deck = [];
RUMMY.computerPlayer.parentInfoObj = {};



RUMMY.createarrayofcards = function (callcreatehtmldeck){
    this.whole_deck = [];
    var second_key ='',
        suit_object = '',
        key;
    for (key in this.deckofcards) {
            suit_object = this.deckofcards[key]; // {hearts, diamonds, clubs, spades }
            var suit = suit_object;	
            for (second_key in suit) {	     //second_key is ace, two, three, etc    
                 this.whole_deck.push(second_key + ' of ' + key + ' ' + suit[second_key]);  //e.g ace of hearts 1
            } 		
    }
    this.whole_deck = this.whole_deck.shuffle(); //shuffling the deck
    if (callcreatehtmldeck === true) {
            this.fillinmaincontent();
            this.loopthroughdiv();
            this.events.dealcards();
    }
};

RUMMY.createhtmlDeck = function (wholeDeck) {
    this.each_suit = this.each_suit.shuffle(); //shuffle the deck
    var html = '<section id="deck">';
    var eachsuitlength = this.each_suit.length;
    var wholedecklength = wholeDeck.length,
        i,
        j;
    for (i=0; i < wholedecklength; i++) {
            for (j=0; j<eachsuitlength; j++) {
                if (this.whole_deck[i].match(this.each_suit[j])) {
                    html += '<section class="wrapper"><div class='+this.each_suit[j]+'>' + wholeDeck[i] + '</div><div class="back"></div></section>';
                } 
            } // end inner for loop
    }
    html += '</section>';
    return html;
};

RUMMY.fillinmaincontent = function() {
	var main_content = document.getElementById('main_content');
	main_content.innerHTML = this.createhtmlDeck(this.whole_deck); // creates the deck
	var buttons = '<article><button id="deal">dealcards</button> <button disabled id="reshuffle">reshuffle</button><button id="takeCard" class="hide">Take from deck</button> <button id="knock" class="hide">Knock</button> </article>'; 
	$(main_content).append(buttons);
        this.helpfulHints('first');
};


RUMMY.loopthroughdiv = function () {
    var html_text;
    var html_text_num;
    $('#deck div').not('.back').each(function (i) { 
            html_text = $(this).text();
            html_text_num = html_text.substr(html_text.length - 2);
            var space = html_text.split(" ");
            $(this).attr('data-value', $.trim(html_text_num)).addClass(space[0]);
            $(this).parent().css({top:1+i, left:1+i, zIndex: 1+i});
            $(this).html(function() {
                    var last = space.pop();
                    var new_html = "<p>" + space.join(" ") + "</p><a href='#'>" + RUMMY.discard + "</a><span>"+last+"</span>";
                    return new_html;
            });
    });
};

RUMMY.events =  {
    //this runs only once this is the initial deal!
    dealcards: function () {
      var that = this;
      var deal = document.getElementById('deal');
      var $doItforTheChildren = $('#deck').children();
      deal.addEventListener('click', function () {
            var k = 1; var i = 52;
            RUMMY.helpfulHints()
            this.className += ' hide';
            //check these values on second call of deal cards  and k as well console log those bitches
            var refreshIntervalId = setInterval(function() {                     
                    if (i % 2 === 1) {
                            $doItforTheChildren.eq(i).addClass('player temp').css({'-webkit-transform': 'translateX('+(k-50)+'px)','transform':'translateX('+(k-50)+'px)','zIndex':k+2 }).removeStyle('top');//.removeStyle('z-index') // player one
                            } else {                                
                            $doItforTheChildren.eq(i).addClass('comp_player temp').css({left: k-50, 'top': '-185px'}); // computer player
                    }
                    k = 50 + k;
                    i = i-1;
                    if (i < 32) {     //10 cards each 52-32         
                  //  $('#deck').children('.player').removeStyle('z-index')
                    that.flipNewDeck('player', $('#deck .player'));
                    that.flipNewDeck('comp', $('#deck .comp_player'));
                    clearInterval(refreshIntervalId);
                    }
            }, 300); // end setInterval	
       }, false);	
    },
    
    flipNewDeck: function (whichPlayer, $object) { // run initially once
        var that = this;
        if (whichPlayer === 'player') {        
                $object.removeClass('temp');
                setTimeout(function () {
                        var flag = true;
                        var top_pos = $object.position().top;
                        top_pos = top_pos; // because of min-height on main content div
                        var left = $object.parent().offset().left;
                        $('#player').css({position:'relative', top:'-185px', marginLeft:(left)});                      
                        setTimeout(function() {
                            var obj = $object.get().reverse();
                            $object.addClass('flipchild').children('div').addClass('flip').on(transitionEndEvent, function() { 
                                $(obj).appendTo('#player #area').removeAttr('style');
                                if (flag) {
                                    that.switchitupyo($object);
                                }
                                flag = false;                               
                            });       	
                        }, 1000);
                }, 2000);
        } else { //it's computer player
            $object.removeClass('temp');                                        
                setTimeout(function () {
                    var top_pos = $object.position().top;
                    top_pos = top_pos -15; // because of min-height on main content div
                    var left = $object.parent().offset().left;
                    $('#comp_player').css({position:'relative', top:-top_pos, marginLeft:(left)});
                    $object.appendTo('#comp_player #comp_area');
                }, 4000);
        }
        
    },
	
    flipCards: function (which_one, $object) {
        var that = this;
        if (which_one === "new_card") {                  
                   setTimeout(function () {
                     var flag = true;
                     $object.addClass('flipchild').children('div').addClass('flip').on(transitionEndEvent, function() { 
                        $object.removeClass('temp').prependTo('#player #area').removeAttr('style');
                        if (flag) {
                            that.playerHover($object, 'one');                          
                        }
                        flag = false;                      
                      }); 
                   }, 1);                
        }
       
        if (which_one === "top_card") {
            setTimeout(function () {                         
                var flag = true;
                var currentCard = $object.offset().left;
                var currentDeck = $('#area section:first-child').offset().left;
                var whereToGo = (currentDeck - currentCard) -50;
                whereToGo = ($object.hasClass('showdacard')) ? -49 : whereToGo;
                $object.removeStyle('top').addClass('player temp speedUpAnimation').css({'-webkit-transform': 'translateX('+whereToGo+'px)','transform':'translateX('+whereToGo+'px)' })
                .one(transitionEndEvent, function() { 
                       $object.removeClass('showdacard flipit temp').addClass('flipchild').prependTo('#player #area').removeAttr('style');
                       that.playerHover($object, 'one');
                });
            }, 50);

        }
    },	//end flipCards
	
    switchitupyo: function () {
        var zindex = 52;
        zindex ++;
        $("#area").sortable({ 
            axis: "x", 
            cursor: "move",
            start: function (event, ui) {
               // $(ui.item).find('a').removeClass('discard');
            }
        }); 
        $('#reshuffle').removeAttr('disabled');
        this.reshuffle();
        this.dealfirstcard();
    },
	
    reshuffle: function () {
            var reshuffle = document.getElementById('reshuffle');
            reshuffle.addEventListener('click', function() {
                main_content.innerHTML = '';
                $('#player #area, #comp_player #comp_area').empty().parent().removeAttr('style');
                RUMMY.createarrayofcards(true);
            }, false);
    },
	
    dealfirstcard: function (first) {
            var $deck = $('#deck')
            var deck = $deck.get(0); // get last child fix this 3/29
            var deckLastChild = deck.lastElementChild;
            var that = this;
            var $takeCard = $('#takeCard');
            var $knockCard = $('#knock')
            $(deckLastChild).removeStyle('left').addClass('showdacard delt').on(transitionEndEvent, function() {      
                $(this).addClass('flipit').children('div').addClass('flipit taketopCard ').on(transitionEndEvent, function() {                    
                    $takeCard.removeClass('hide').next().removeClass('hide').attr('disabled', true)
                    $(this).find('a').text(RUMMY.takeCard).addClass('take');                    
                });                
            });
            that.takeNextCard($deck, $takeCard, $(deckLastChild));
            RUMMY.helpfulHints('second');
    },
	
    playerHover: function (obj) {
            var $objPlusSiblings = obj.siblings().addBack();
            var howManyCards = obj.siblings().length;
            var that = this;
            if (howManyCards > 9) {
                $objPlusSiblings.find('a').addClass('discard');
            } else {
                $objPlusSiblings.find('a').removeClass('discard');
            }
            if (!RUMMY.playHoverCalled) {
                var $playerArea = obj.parent();
                this.preDiscard($playerArea);
                RUMMY.playHoverCalled = true;
            }
    },
    
    preDiscard: function ($container) {
         var that = this;        
         $container.on('click', 'a.discard', function (event) {
                    var $section = $(this).parents('section.player');
                    that.discard($(this), $section);
                    RUMMY.helpfulHints();
                    event.preventDefault();
         });
    },
	
    discard: function ($discard, $obj) {
            var that = this;
            $discard.removeClass('discard');
            var $siblings = $obj.siblings();
            $siblings.find('a').removeClass('discard').parent().removeClass('taketopCard');
            var $lastChild = $('#deck').children(':last-child');
            var lastChildPosition = $lastChild.position().left;
            var lastChildzIndex = parseInt($lastChild.css('z-index'));           
            if ($lastChild.hasClass('showdacard') || $lastChild.hasClass('player') || $lastChild.hasClass('comp_player')  ) {
                $obj.appendTo('#deck').css({'z-index':lastChildzIndex +1, "left":lastChildPosition +23, "top":'32px'}).addClass('delt');
            } else {
                $obj.appendTo('#deck').css({'z-index':lastChildzIndex +1, "left":'200px', "top":'32px'}).addClass('delt');
            }
            if (arguments[2] !== 'donotrun') {               
                setTimeout(function () {
                    RUMMY.computerPlayer.events.takeNextCard();
                }, 1000);
            }
            
    },
	
    takeNextCard: function ($deck, takefromdeckbutton, $lastChild) {
        var that = this,
            flag = true,
            removeHelpfulHints = function () {
                RUMMY.helpfulHints('third');               
            };
        
        takefromdeckbutton.on('click', function (ev) {
                this.disabled = true;
                this.nextElementSibling.disabled = false;
                var $topFromDeck = $deck.find('.delt:first').prev() || $deck.find(':last-child').prev();
                $topFromDeck.addClass('player temp speedUpAnimation').css({'-webkit-transform': 'translateX(-50px)','transform':'translateX(-50px)' })
                .removeStyle('top')
                .one(transitionEndEvent, function (event) {
                     that.flipCards('new_card', $(this));
                     if (flag) removeHelpfulHints();
                     flag = false;
                });
              //  $lastChild.find('a').removeClass('take').addClass('hide')
                //deck.prev().removeAttr('style').addClass('player flipchild remove_transition_duration').prependTo('#area');
                //that.playerHover(deck); // fix paramter not deck but obj
        });

        $('#deck').on('click', 'a.take', function (event){
                var takebutton = takefromdeckbutton.get(0);
                takebutton.disabled = true;
                takebutton.nextElementSibling.disabled = false;
                $(this).removeClass('take').text(RUMMY.discard);
		var $parent = $(this).parents('section.wrapper');
                that.flipCards('top_card', $parent);
                 if (flag) removeHelpfulHints();
                 flag = false;
                event.preventDefault();
        });
    }
	
}; // end RUMMY.events

RUMMY.computerPlayer.events = {
    preFilteringOfCreateArray: function ($obj) {
         var suitNCardArray = [];
         var computerDeck = [];
         $obj.children(':first-child').each(function(i, element) {                  
                 var suit_card_n_value = $(this).attr('class');// + ' ' + $(this).attr('data-value');
                 var value = suit_card_n_value.slice(suit_card_n_value.indexOf(' ')+1, suit_card_n_value.length );
                    computerDeck.push(value);
                    suitNCardArray.push(suit_card_n_value);
         });
         this.createNewArray(computerDeck, suitNCardArray);
    },
    
    createNewArray: function (array, withSuit) {
        var arrOfArrays = this.makeArrayofArrays(withSuit);
        var filterOutArrayOfArraysObj = this.furtherFilter(arrOfArrays);
        var anotherObj = this.originalFilter(filterOutArrayOfArraysObj);
       // console.log(anotherObj);
        var sortedObjects = this.decideWhichOnesToKeep(anotherObj);
        //console.log(sortedObjects);
        var objectsGalore = this.findMatches(sortedObjects);
        console.log(objectsGalore);
        var total = this.checkScore(objectsGalore);
        console.log(total);
        var whatCardToRidThisTime = this.shitPile(objectsGalore.possibleDiscard, objectsGalore.maybes, objectsGalore.oneMatch );
        if (typeof whatCardToRidThisTime == 'string') {
            var didwegetMatch = this.checkOneMatch(objectsGalore.oneMatch, objectsGalore.keepTheseOnes);
            console.log(didwegetMatch);
            if (!!didwegetMatch) {
                objectsGalore = this.removeFromOneMatchAddToMoreThanOneMatch(objectsGalore, didwegetMatch)
            } else {
                
            }
        }
        //if (whatCardToRidThisTime.length>2) whatCardToRidThisTime.slice(0,2);
        whatCardToRidThisTime[1] = '.' + RUMMY.cardArray[whatCardToRidThisTime[1]-1];
        var stringToDiscard = whatCardToRidThisTime.join('');
        console.log(stringToDiscard);
        var $obj = this.findCardtoDiscard(stringToDiscard);
        var $parent = $obj.parent();
        RUMMY.computerPlayer.parentInfoObj = this.getStyles($parent);
        $obj.addClass('taketopCard').find('a').text(RUMMY.takeCard).addClass('take');
        $parent.addClass('flipit');
        RUMMY.events.discard($obj, $parent ,'donotrun');
        $('#takeCard').removeAttr('disabled').next('#knock').attr('disabled', true);     
    },

  
    originalFilter: function (object) {
        var prop;
        var i;
        var clubs = [];
        var spades = [];
        var diamonds = [];
        var hearts = [];
        var obj = {};
        
        for (prop in object) {
            for (i=0; i<object[prop].length; i++) {
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
        
        function loopEm () {         
            for (var j=0; j<arguments.length; j++) {
                for (var k = 0; k < arguments[j].length; k++) {                  
                    if (arguments[j].length >= 1) {
                        arguments[j].sort(function(a,b){return a-b});
                    }
                }
            }
            
            obj.clubs = arguments[0];
            obj.spades = arguments[1];
            obj.diamonds = arguments[2];
            obj.hearts = arguments[3];
            
            return obj;
        }
        
        return loopEm(clubs, spades, diamonds, hearts);
        
        function testFunction (value) {
	 return getValues(value);
        }


        function getValues (string) {
            var prop;
            for (prop in RUMMY.cardValues) {
                if (prop == string) {
                   return RUMMY.cardValues[prop];
                }
            }

        }
    },
    
    
    decideWhichOnesToKeep: function (obj) {
        var keepTheseOnes = {};
        var maybes = {};
        var possibleDiscard = {};
  
        for (var prop in obj) {
                keepTheseOnes[prop] = [];
                maybes[prop] = [];
                possibleDiscard[prop] = [];
                for (var i=0; i < obj[prop].length; i++) {
                    if ((obj[prop][i+1]  === obj[prop][i] +1) && (obj[prop][i+2] === obj[prop][i] +2) && (obj[prop][i+3] === obj[prop][i] +3) && (obj[prop][i+4] === obj[prop][i] +4) && (obj[prop][i+5] === obj[prop][i] +5)) {
                                               keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] +1, obj[prop][i] +2, obj[prop][i] +3, obj[prop][i] +4, obj[prop][i] +5);
                                               i=i+5;
                    } else if ((obj[prop][i+1]  === obj[prop][i] +1) && (obj[prop][i+2] === obj[prop][i] +2) && (obj[prop][i+3] === obj[prop][i] +3) && (obj[prop][i+4] === obj[prop][i] +4)) {
                                               keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] +1, obj[prop][i] +2, obj[prop][i] +3, obj[prop][i] +4);
                                               i=i+4;
                    } else if ((obj[prop][i+1]  === obj[prop][i] +1) && (obj[prop][i+2] === obj[prop][i] +2) && (obj[prop][i+3] === obj[prop][i] +3)) {
                                               keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] +1, obj[prop][i] +2, obj[prop][i] +3);
                                               i=i+3;
                    } else if ((obj[prop][i+1]  === obj[prop][i] +1) && (obj[prop][i+2] === obj[prop][i] +2)) {
                                               keepTheseOnes[prop].push(obj[prop][i], obj[prop][i] +1, obj[prop][i] +2);
                                               i=i+2;
                    } else if ((obj[prop][i+1]  === obj[prop][i] +1) && obj[prop][i+1] < 7 ) {
                                               maybes[prop].push(obj[prop][i], obj[prop][i] +1);
                                               i++;
                    } else {
                                              possibleDiscard[prop][i] = obj[prop][i]
                    }              
                }
        }

          function removeUndefineds (obj) {
              var otherObj = {};
              for (var prop in obj) {
                  otherObj[prop] = obj[prop].filter(function(n){ return n != undefined });
              }
              
              return otherObj;
          }

        return {
            keepTheseOnes: keepTheseOnes,
            maybes: maybes,
            possibleDiscard: removeUndefineds(possibleDiscard)
        }
        
    },
    
    findMatches: function (objOfObjects)  {
        var properties = ['clubs', 'diamonds', 'hearts', 'spades'];
        var propertyLength = properties.length;
        var testArray = [];
    	for (var j in objOfObjects ) {
                    if (j != "keepTheseOnes") {
                        for (var k = 0; k < propertyLength; k++) {	
                                for (var i=0; i<objOfObjects[j][properties[k]].length; i++) {
                                        testArray.push(objOfObjects[j][properties[k]][i]);
                                }
                        }
                    }
    	}
        testArray.sort(function (a,b) {
            return a - b;
        });
        objOfObjects.oneMatch = [];
        objOfObjects.moreThanOneMatch = [];
        function findDupes (arr) {
            var counts = {};
            var matches = false;
            for(var i = 0; i< arr.length; i++) {
                var num = arr[i];
                counts[num] = counts[num] ? counts[num]+1 : 1;
            }
            
            for (var prop in counts) {
                if (counts[prop] == 1) {
                    delete counts[prop]
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
            removeFromDiscard(objOfObjects.oneMatch, objOfObjects.moreThanOneMatch );
            return objOfObjects;
        } else {
            return objOfObjects;
        }

        
        function removeFromDiscard(arr1, arry2) {
                var arr = arr1.concat(arry2);
                var x = -1;
                function loop (j, discardOrMaybe) {
                    for (var prop in objOfObjects[discardOrMaybe] ) {
                        for (var i=0; i<objOfObjects[discardOrMaybe][prop].length; i++)
                        if (arr[j] == objOfObjects[discardOrMaybe][prop][i] ){
                                objOfObjects[discardOrMaybe][prop].splice(i, 1)
                        }
                    }
                    
                    if (j<arr.length) {
                            j++;
                            loop(j, discardOrMaybe );
                    }

                    return discardOrMaybe;
 
                }
                var endFirstLoop = loop(0, 'possibleDiscard');
                
                if (endFirstLoop == "possibleDiscard") {
                    loop(0, 'maybes');
                }
       }
       
    },

    checkScore: function (obj) {
        var keys = Object.keys(obj);
        var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        var suitLength = suits.length;
        var keyLength = keys.length;
        var i=0;
        var k=0;
        var p = 0;
        var totalCountAll = [];
        var total;

        function addUpValues (arr) {
            var length = arr.length;
            var value = 0;
            var i = 0;
            for (var i = 0; i<arr.length; i++) {
                value += arr[i]
            }

            return value;
        }

        for (i; i<keyLength; i++) {
            if (keys[i] !== "keepTheseOnes" && keys[i] !== "moreThanOneMatch" ) {
                if (Array.isArray(obj[keys[i]])) {
                     for (var j=0; j<obj[keys[i]].length; j++) {
                            totalCountAll.push(parseInt((obj[keys[i]][j]) * 2))
                     }
                }

                if ($.isPlainObject(obj[keys[i]])) {
                    var key = Object.keys(obj[keys[i]]);
                    for (var prop in obj[keys[i]]) {
                        if (obj[keys[i]][prop].length) {
                            for (var x =0; x<obj[keys[i]][prop].length; x++) {
                                totalCountAll.push((obj[keys[i]][prop][x]));
                            }
                        }                      
                    }
                }


            }
        }

        return addUpValues(totalCountAll);
    },
    
shitPile: function (discardObj, maybeObj) {
    var arr= [];
    var i =0;
    var prop;
    var args = arguments;

    function looping(num, i) {
            for (prop in args[i]) {
                console.log(args[i])
                for (var j = 0; j< args[i][prop].length; j++) {
                    console.log(args[i][prop][j] + ' ' + num)
                    if (args[i][prop][j] > num) {
                            arr.push('.'+prop,args[i][prop][j]);
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
    
    checkOneMatch: function (oneMatch, keepObj) {
        //http://jsfiddle.net/A4eJ8/5/
        var arr = RUMMY.each_suit;
        var first = [];
        var last =[];       
        var findMultiples = function (obj) {
            var foundMatch = [];
            for (var i =0; i<arr.length; i++) {                
                if (obj[arr[i]].length == 4) {
                    first = obj[arr[i]].slice(0,1);
                    last =  obj[arr[i]].slice(-1);
                    foundMatch.push(first.join(), last.join());
                }

                if (obj[arr[i]].length == 5) {
                    first = obj[arr[i]].slice(0,1);
                    last =  obj[arr[i]].slice(-1);
                    foundMatch.push(first, last);
                }
            }
            
            return foundMatch
        };
        var compareToOneMatch = function (arr) {
            for (var i=0; i<arr.length; i++) {
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
    
    removeFromOneMatchAddToMoreThanOneMatch: function (obj, finalNum) {
        var oneMatch = obj.oneMatch;
        var index = oneMatch.indexOf(finalNum);
        oneMatch.splice(index, 1);
        obj.moreThanOneMatch.push(finalNum);
        return obj;
    },
    
    
    furtherFilter: function (arr) {
            var spades = [],
                hearts = [],
                diamonds = [],
                clubs = [],
                i,
                j;
            for (i=0; i< arr.length; i++) {
                for (j=0; j<arr.length; j++) {
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
            return {
                spades:spades || null,
                hearts:hearts || null,
                diamonds:diamonds || null,
                clubs:clubs || null
            };
    },
    
    makeArrayofArrays: function (array) {
        var length;
        var another = [];
        var i;
        var cardFace = [];
        var compDeck = array;
        for (i=0, length = compDeck.length; i < length; i++) {
                another = compDeck[i].split(' ');
                compDeck[i] = another;
                     //  console.log(compDeck[i]);
                for (var j=0; j < compDeck[i].length; j++) {
                    if (j === 1) {
                       cardFace.push(compDeck[i][j]);     
                    }               
                }
        }
        return compDeck;
    },
    

    
    findCardtoDiscard: function (eleClass) {
      return $('#comp_area').find(eleClass).addClass('discard');
    },
    
    getStyles: function ($ele) {
        var obj = {};
        obj.top = $ele.css('top');
        obj.left = $ele.css('left');
        obj.zIndex = $ele.css('zIndex');
        obj.index = $ele.index();
        return obj;
    },
    
    takeNextCard: function () {
       var that = this;
       var $deck = $('#deck');
       var lastInHandLeftPos = parseInt($('#comp_area').children(':first-child').css('left'));
       var pos = RUMMY.computerPlayer.parentInfoObj.left || lastInHandLeftPos + 50+'px';
       var zIndex = RUMMY.computerPlayer.parentInfoObj.zIndex || 25;
       var $lastInDeck = $deck.find('.delt:first').prev();
       $lastInDeck.addClass('comp_player temp').css({'left':pos, 'top': '-185px', 'zIndex':zIndex}).one(transitionEndEvent, function () {
               // $(this).insertAfter('#comp_player #comp_area section:eq('+eq+')').addClass('testies')
                $(this).prependTo('#comp_player #comp_area');
                var $selfAndSiblings = $(this).siblings().andSelf();
                that.preFilteringOfCreateArray($selfAndSiblings);          
       });
       //RUMMY.events.flipCards('comp', $lastInDeck);
    }
    
    
    
}; //end computer player events object


RUMMY.overlay = function () { 
  // var $triggerBttn = $('#trigger-overlay'),
     var $overlay = $('div.overlay'),
       $closeBttn = $overlay.find( 'button.overlay-close' ),
       toggleOverlay = function (e) {
           if (e) e.preventDefault();
            if( $overlay.hasClass('open')) {
                $overlay.removeClass('open');
                $overlay.addClass('close');
                var onEndTransitionFn = function( ) {
                        $overlay.removeClass( 'close' );
                };
                $overlay.on( transitionEndEvent, onEndTransitionFn );
                $('#intro').fadeOut();
            }
            else if( !($overlay.hasClass('close')) ) {
                    $overlay.addClass('open');
            }
            
            else {
                    $overlay.addClass('open');
            }
       };
       
       //$triggerBttn.on( 'click', toggleOverlay );
       $closeBttn.on( 'click', toggleOverlay );
       
          if (window.localStorage.getItem('modal') !== "falsy") {
              toggleOverlay();
              setTimeout(function () {
                    var audio = document.getElementById('shallWePlayAGame');
                    audio.play();
              }, 2000);
          }
          
          window.localStorage.setItem('modal', "falsy");
          //window.localStorage.clear() for testing purposes
   
   
};


RUMMY.helpfulHints = function (param) {
    $('div.bubble').addClass('hide');
    var secondString = 'Sort your cards by either suit or match. Drag each card with your mouse. When you are done sorting, either take the top card from the discard pile or click take from deck button';
    var thirdString = "Before you discard any of your cards you have the option to knock (end the game) - Any remaining cards that are not part of a valid combination are considered deadwood, \n\
                      the total value of your deadwood should be ten points or less or you will be alerted that you are unable to knock if you are able to knock you point total will compared to Joshuas(the computer) too see if you won or lost"
    var $html = null;
    if (param === 'first') {
        $html = $('<div class="first_bubble bubble">Click below to start game</div>');
        $html.appendTo('#main_content');
    }
    
    if (param === 'second') {
        $html = $('<div class="second_bubble bubble">'+secondString+'</div>');
        $html.appendTo('body');
        setTimeout(function () {
            $html.addClass('animated')
        },1000);
    }
    
    if (param === "third") {
        $html = $('<div class="third_bubble bubble">'+thirdString+'</div>');
        $html.appendTo('body');
        setTimeout(function () {
            $html.addClass('animated')
        },1000);
    }
}

//RUMMY.computerPlayer.events.createNewArray
	
$(document).ready(function () {
	RUMMY.createarrayofcards();
	RUMMY.fillinmaincontent();
	RUMMY.loopthroughdiv();
	
	//events
	RUMMY.events.dealcards();
	RUMMY.events.reshuffle();
        RUMMY.overlay();
}); // end document.ready

				










