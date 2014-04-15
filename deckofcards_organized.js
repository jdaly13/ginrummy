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
    RUMMY.whole_deck = [];
    var second_key ='',
        suit_object = '',
        key;
    for (key in RUMMY.deckofcards) {
            suit_object = RUMMY.deckofcards[key]; // {hearts, diamonds, clubs, spades }
            var suit = suit_object;	
            for (second_key in suit) {	     //second_key is ace, two, three, etc    
                 RUMMY.whole_deck.push(second_key + ' of ' + key + ' ' + suit[second_key]);  //e.g ace of hearts 1
            } 		
    }
    RUMMY.whole_deck = RUMMY.whole_deck.shuffle(); //shuffling the deck
    if (callcreatehtmldeck === true) {
            RUMMY.fillinmaincontent();
            RUMMY.loopthroughdiv();
            RUMMY.events.dealcards();
    }
};

RUMMY.createhtmlDeck = function (wholeDeck) {
    RUMMY.each_suit = RUMMY.each_suit.shuffle(); //shuffle the deck
    var html = '<section id="deck">';
    var eachsuitlength = RUMMY.each_suit.length;
    var wholedecklength = wholeDeck.length,
        i,
        j;
    for (i=0; i < wholedecklength; i++) {
            for (j=0; j<eachsuitlength; j++) {
                if (RUMMY.whole_deck[i].match(RUMMY.each_suit[j])) {
                    html += '<section class="wrapper"><div class='+RUMMY.each_suit[j]+'>' + wholeDeck[i] + '</div><div class="back"></div></section>';
                } 
            } // end inner for loop
    }
    html += '</section>';
    return html;
};

RUMMY.fillinmaincontent = function() {
	var main_content = document.getElementById('main_content');
	main_content.innerHTML = this.createhtmlDeck(RUMMY.whole_deck); // creates the deck
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
      deal.addEventListener('click', function () {
            var k = 1; var i = 52;
            RUMMY.helpfulHints()
            this.className += ' hide';
            //check these values on second call of deal cards  and k as well console log those bitches
            var refreshIntervalId = setInterval(function() {                     
                    if (i % 2 === 1) {
                            $('#deck').children().eq(i).addClass('player temp').css({'-webkit-transform': 'translateX('+(k-50)+'px)','transform':'translateX('+(k-50)+'px)','zIndex':k+2 }).removeStyle('top');//.removeStyle('z-index') // player one
                            } else {                                
                            $('#deck').children().eq(i).addClass('comp_player temp').css({left: k-50, 'top': '-185px'}); // computer player
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
                   }, 50);                
        }
       
        if (which_one === "top_card") {
            setTimeout(function () {                         
                var flag = true;
                var currentCard = $object.offset().left;
                var currentDeck = $('#area section:first-child').offset().left;
                var whereToGo = (currentDeck - currentCard) -50;
                whereToGo = ($object.hasClass('showdacard')) ? -49 : whereToGo;
                $object.removeStyle('top').addClass('player temp').css({'-webkit-transform': 'translateX('+whereToGo+'px)','transform':'translateX('+whereToGo+'px)' })
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
                $topFromDeck.addClass('player temp').css({'-webkit-transform': 'translateX(-50px)','transform':'translateX(-50px)' })
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
        console.log(array);
        var firstPart = this.removeDuplicates(array);
        console.log(firstPart);
        var whichIndex = this.findTheHighCards(firstPart[0]);
        var arrOfArrays = this.makeArrayofArrays(withSuit);
        //var testingNewIdea = this.firstFilteringOut(firstPart,arrOfArrays )
        console.log(arrOfArrays);
        var filterOutArrayOfArraysObj = this.furtherFilter(arrOfArrays);
        var anotherObj = this.originalFilter(filterOutArrayOfArraysObj);
        console.log(anotherObj);
        var sortedObjects = this.decideWhichOnesToKeep(anotherObj);
        console.log(sortedObjects);
        var matches = this.findMatches(sortedObjects);
        console.log(matches);
        
        var getNumber = this.getNumber(filterOutArrayOfArraysObj);
        var cardToDiscard = RUMMY.computerPlayer.cardToDiscard = firstPart[0][whichIndex];
        //console.log(cardToDiscard);
        var $obj = this.findCardtoDiscard(cardToDiscard);
        var $parent = $obj.parent();
        RUMMY.computerPlayer.parentInfoObj = this.getStyles($parent);
      //  this.moveParents(parentInfoObj, $parent.parent(), $parent.prev())
        $obj.addClass('taketopCard').find('a').text(RUMMY.takeCard).addClass('take');
        $parent.addClass('flipit');
        RUMMY.events.discard($obj, $parent ,'donotrun');
        $('#takeCard').removeAttr('disabled').next('#knock').attr('disabled', true);     
    },
    
    moveParents: function (infoObj, $compArea, $prev) {
        var left = infoObj.left;
        console.log(infoObj);
        console.log($prev);
       if (infoObj.index != 0) setTimeout(function () {$prev.css('left',left )}, 2000);
        
         //.next().css('left', left);     
    },
    
    getNumber: function (obj) {
        for (var j = 0; j < RUMMY.each_suit.length; j++ ) {
            if (RUMMY.each_suit[j] === "spades") {
                var spades = [];
                var numberedArray = actualNumbers(j, spades);
                findConsecutive(numberedArray);
              //  console.log(numberedArray);
            }            
        }
        
        function actualNumbers (j, suit) {
            for(var i = 0; i < obj[RUMMY.each_suit[j]].length; i++) {
                  //  console.log(obj[RUMMY.each_suit[j]][i]);
                  //  console.log(RUMMY.one_suit[obj[RUMMY.each_suit[j]][i]]);
                    suit.push(RUMMY.one_suit[obj[RUMMY.each_suit[j]][i]]);
            }
            return suit;
        }
        
        function findConsecutive(array) {
                //for statement
        }
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
           // return false;

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
                    } else if (obj[prop][i+1]  === obj[prop][i] +1) {
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
        var objectaArr = [];
	objOfObjects.matches = [];
        var j = 0;
	objectaArr[0] = objOfObjects.maybes
	objectaArr[1] = objOfObjects.possibleDiscard
	for (var j=0; j<objectaArr.length; j++) {
		for (var prop in objectaArr[j]) {
			for (var i=0; i<objectaArr[j][prop].length; i++) {
				lookforothers(objectaArr[j][prop][i], prop, j);
			}
		}
	}
	if (objOfObjects.matches.length) {
            removeFromDiscard(objOfObjects.matches)
        }
        return objOfObjects;
	function lookforothers(num, prop, j) {
			if (prop == 'spades') {
				return false;
			}
			
			if (prop =='hearts') {
				prop = 'spades'
			}
			
			if (prop =='diamonds') {
				prop = 'hearts'
			}
			
			if (prop == 'clubs') {
				prop = 'diamonds'
			}
			
			
			//if (!j) j=1;
			for (var i=0; i<objectaArr[j][prop].length; i++) {
				if (num == objectaArr[j][prop][i]) {
						objOfObjects.matches.push(num);
				}
			}
			
			lookforothers(num, prop, j++);
	}
        
        function removeFromDiscard(arr) {
                var length = arr.length;
                j = 0;
                function loop (j) {
                    for (var prop in objOfObjects.possibleDiscard ) {
                        for (var i=0; i<objOfObjects.possibleDiscard[prop].length; i++)
                        if (arr[j] == objOfObjects.possibleDiscard[prop][i] ){
                                objOfObjects.possibleDiscard[prop].splice(i, 1)
                        }
                    }
                    j++;
                }
                
                if (j<length) {
                    loop(j)
                }
                
                
        }
    },
    
    firstFilteringOut: function (matchesArr, arrayofArrays) {
            var i,
                j,
                array = [];
                console.log(matchesArr);
                console.log(arrayofArrays)
                
            for (i=1; i<matchesArr.length; i++) {
                if (typeof matchesArr[i] == 'undefined') i= i+1;
                 for (j=0; j<matchesArr[i].length; j++) {
                     console.log(matchesArr[i]);
                     var data = matchesArr[i][j];
                     console.log(data);
                     removeFromArrayofArrays(data);
                 }
            }
            
            function removeFromArrayofArrays(whatToRemove) {
                    var i,
                        j;
                        
                    for (i=0; i<arrayofArrays.length; i++) {
                        if (whatToRemove === arrayofArrays[i][1] ) {
                            array.push(i)
                        }
                      
                    }              
            }
                                console.log(array);
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
    
    removeDuplicates: function (arr) {
        var counts = {};
        for(var i=0; i<arr.length; i++) {
            var item = arr[i];
            counts[item] = (counts[item] || 0)+1;
            
        }
        var array = [],
        finalArray = new Array(4),       
        items;
        for(var j=0; j<finalArray.length; j++) {
            finalArray[j] = [];
        }
        for(items in counts) {
            if(counts[items] === 1) {
                array.push(items);
                finalArray[0] = array
            }
            
            if(counts[items] === 2) {
                //its a match
                finalArray[1].push(items)
            }
            
            if(counts[items] === 3) {
                //its 3 good enough for points
                finalArray[2].push(items)
            }
            
            if(counts[items] === 4) {
                //its 4 fucking perfect
                finalArray[3].push(items)
            }
            
            
            
            
            
            
        }
        return finalArray;
    },
    
    
    findTheHighCards:function (arr) {
        for (var i=0; i < arr.length; i++) {
            if (arr[i] === "king" || arr[i] === "queen" || arr[i] === "jack" || arr[i] === "ten" || arr[i] === "nine" ) {
                return i;
            }
        }
        return Math.floor(Math.random() * (arr.length - 0 + 1) + 0);       
    },
    
    findCardtoDiscard: function (eleClass) {
      return $('#comp_area').find('.'+eleClass).addClass('discard');
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

				










