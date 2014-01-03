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
}
RUMMY.each_suit = ['spades', 'clubs', 'hearts', 'diamonds'];
RUMMY.takeCard = "take";
RUMMY.discard = "discard";
RUMMY.playHoverCalled = false;
RUMMY.deckofcards = (function () {
    var deck = {},
        i,
        len;
    for (i=0, len = RUMMY.each_suit.length; i < len; i++) {
	deck[RUMMY.each_suit[i]] = Object.create(RUMMY.one_suit);
    }
    return deck;
}()); // returns object

RUMMY.computerPlayer = {};
RUMMY.computerPlayer.deck = [];



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
}

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
}

RUMMY.fillinmaincontent = function() {
	var main_content = document.getElementById('main_content');
	main_content.innerHTML = this.createhtmlDeck(RUMMY.whole_deck); // creates the deck
	var buttons = '<article><button id="deal">dealcards</button> <button disabled id="reshuffle">reshuffle</button><button id="takeCard" class="hide">Take from deck</button> </article>'; 
	$(main_content).append(buttons);
}


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
}

RUMMY.events =  {
    //this runs only once this is the initial deal!
    dealcards: function () {
      var deal = document.getElementById('deal');
      deal.addEventListener('click', function () {
            var k = 1; var i = 52;
            this.disabled = true;
            //check these values on second call of deal cards  and k as well console log those bitches
            var refreshIntervalId = setInterval(function() {                     
                    if (i % 2 === 1) {
                            $('#deck').children().eq(i).addClass('player temp').css({'-webkit-transform': 'translateX('+(k-50)+'px)','transform':'translateX('+(k-50)+'px)','zIndex':k+2 }).removeStyle('top');//.removeStyle('z-index') // player one
                            } else {                                
                        $('#deck').children().eq(i).addClass('comp_player temp').css({left: k-50, 'top': '-185px'}) // computer player
                    }
                    k = 50 + k;
                    i = i-1
                    if (i < 32) {     //10 cards each 52-32         
                  //  $('#deck').children('.player').removeStyle('z-index')
                    RUMMY.events.flipNewDeck('player', $('#deck .player'));
                    RUMMY.events.flipNewDeck('comp', $('#deck .comp_player'));
                    clearInterval(refreshIntervalId);
                    }
            }, 300) // end setInterval	
       }, false);	
    },
    
    flipNewDeck: function (whichPlayer, $object) { // run initially once
        var that = this;
        if (whichPlayer === 'player') {        
                $object.removeClass('temp');
                setTimeout(function () {
                        var flag = true;
                        var top_pos = $object.position().top
                        top_pos = top_pos; // because of min-height on main content div
                        var left = $object.parent().offset().left
                        $('#player').css({position:'relative', top:'-185px', marginLeft:(left)})                      
                        setTimeout(function() {
                            var obj = $object.get().reverse();
                            $object.addClass('flipchild').children('div').addClass('flip').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() { 
                                $(obj).appendTo('#player #area').removeAttr('style')
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
                    var top_pos = $object.position().top
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
                     $object.addClass('flipchild').children('div').addClass('flip').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() { 
                        $object.removeClass('temp').prependTo('#player #area').removeAttr('style');
                        if (flag) {
                            that.playerHover($object, 'one');
                            
                        }
                        flag = false;
                        
                      }) 
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
                .one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() { 
                       $object.removeClass('showdacard flipit temp').addClass('flipchild').prependTo('#player #area').removeAttr('style');
                       that.playerHover($object, 'one');
                });
            }, 50)

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
            }, false)
    },
	
    dealfirstcard: function (first) {
            var deck = $('#deck').get(0) // get last child fix this 3/29
            var deckLastChild = deck.lastElementChild;
            var that = this;
            var $takeCard = $('#takeCard');
            $(deckLastChild).removeStyle('left').addClass('showdacard delt').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {      
                $(this).addClass('flipit').children('div').addClass('flipit taketopCard ').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {                    
                    $takeCard.removeClass('hide');
                    $(this).find('a').text(RUMMY.takeCard).addClass('take');                    
                }); 
                
            });
            that.takeNextCard($('#deck'), $takeCard, $(deckLastChild));
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
                    event.preventDefault();
         });
    },
	
    discard: function ($discard, $obj) {
            var that = this;
            $discard.removeClass('discard');
            var $siblings = $obj.siblings();
            $siblings.find('a').removeClass('discard').parent().removeClass('taketopCard')
            var $lastChild = $('#deck').children(':last-child');
            var lastChildPosition = $lastChild.position().left;
            var lastChildzIndex = parseInt($lastChild.css('z-index'));           
            if ($lastChild.hasClass('showdacard') || $lastChild.hasClass('player') || $lastChild.hasClass('comp_player')  ) {
                $obj.appendTo('#deck').css({'z-index':lastChildzIndex +1, "left":lastChildPosition +23, "top":'32px'}).addClass('delt')
            } else {
                $obj.appendTo('#deck').css({'z-index':lastChildzIndex +1, "left":'200px', "top":'32px'}).addClass('delt')
            }
            if (!(arguments[2] === 'donotrun')) {
                setTimeout(function () {
                    RUMMY.computerPlayer.events.takeNextCard();
                }, 1000)
            }
            
    },
	
    takeNextCard: function ($deck, takefromdeckbutton, $lastChild) {
        var that = this;
        takefromdeckbutton.on('click', function (ev) {
                this.disabled = true;
                var $topFromDeck = $deck.find('.delt:first').prev() || $deck.find(':last-child').prev();
                $topFromDeck.addClass('player temp').css({'-webkit-transform': 'translateX(-50px)','transform':'translateX(-50px)' })
                .removeStyle('top')
                .one('transitionend webkitTransitionEnd', function (event) {
                     that.flipCards('new_card', $(this));
                });
              //  $lastChild.find('a').removeClass('take').addClass('hide')
                //deck.prev().removeAttr('style').addClass('player flipchild remove_transition_duration').prependTo('#area');
                //that.playerHover(deck); // fix paramter not deck but obj
        });

        $('#deck').on('click', 'a.take', function (event){
                var takebutton = takefromdeckbutton.get(0);
                takebutton.disabled = true;
                $(this).removeClass('take').text(RUMMY.discard)
		var $parent = $(this).parents('section.wrapper');
                that.flipCards('top_card', $parent);
                event.preventDefault();
        });
    }
	
} // end RUMMY.events

RUMMY.computerPlayer.events = {
    preFilteringOfCreateArray: function ($obj) {
         var suitNCardArray = [];
         var computerDeck = [];
         $obj.children(':first-child').each(function(i, element) {                  
                 var suit_card_n_value = $(this).attr('class');// + ' ' + $(this).attr('data-value');
                 var value = suit_card_n_value.slice(suit_card_n_value.indexOf(' ')+1, suit_card_n_value.length )
                    computerDeck.push(value);
                    suitNCardArray.push(suit_card_n_value);
         });
         this.createNewArray(computerDeck, suitNCardArray);
    },
    
    createNewArray: function (array, withSuit) {
        var firstPart = this.removeDuplicates(array);
        var whichIndex = this.findTheHighCards(firstPart);
        var arrOfArrays = this.makeArrayofArrays(withSuit);
        var filterOutArrayOfArraysObj = this.furtherFilter(arrOfArrays);
        var getNumber = this.getNumber(filterOutArrayOfArraysObj)
        var cardToDiscard = RUMMY.computerPlayer.cardToDiscard = firstPart[whichIndex];
        var $obj = this.findCardtoDiscard(cardToDiscard);
        var $parent = $obj.parent();
        var cssStyles = RUMMY.computerPlayer.events.getStyles($parent);
        console.log(cssStyles);
        $obj.addClass('taketopCard').find('a').text(RUMMY.takeCard).addClass('take');
        $parent.addClass('flipit');
        RUMMY.events.discard($obj, $parent ,'donotrun');
        $('#takeCard').removeAttr('disabled');     
    },
    
    getNumber: function (obj) {
        console.log(obj);
        for (var j = 0; j < RUMMY.each_suit.length; j++ ) {
            if (RUMMY.each_suit[j] === "spades") {
                var spades = []
                test(j, spades)
            }            
        }
        
        function test (j, suit) {
            for(var i = 0; i < obj[RUMMY.each_suit[j]].length; i++) {
                    console.log(obj[RUMMY.each_suit[j]][i])
                    console.log(RUMMY.one_suit[obj[RUMMY.each_suit[j]][i]])
            }
        }
    },
    
    furtherFilter: function (arr) {
            var spades = [],
                hearts = [],
                diamonds = [],
                clubs = [];
            for (i=0; i< arr.length; i++) {
                for (j=0; j<arr.length; j++) {
                    if (arr[j][0] === "spades") {
                        spades.push(arr[j][1])
                    }
                    if (arr[j][0] === "hearts") {
                        hearts.push(arr[j][1])
                    }
                    if (arr[j][0] === "diamonds") {
                        diamonds.push(arr[j][1])
                    }
                    if (arr[j][0] === "clubs") {
                        clubs.push(arr[j][1])
                    }
                }
                break                             
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
        var compDeck = array
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
        var arr = [];
        for(item in counts) {
            if(counts[item] === 1) {
                arr.push(item);
            }
        }
        return arr;
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
        var obj = {}
        obj.top = $ele.css('top');
        obj.left = $ele.css('left');
        obj.zIndex = $ele.css('zIndex');
        return obj;
    },
    
    takeNextCard: function () {
       var that = this;
       var $deck = $('#deck');
       var lastInHandLeftPos = parseInt($('#comp_area').children(':first-child').css('left'));
       var pos = lastInHandLeftPos + 50;
       var $lastInDeck = $deck.find('.delt:first').prev();
       $lastInDeck.addClass('comp_player temp').css({'left': pos+'px', 'top': '-185px'}).one('transitionend', function () {
                $(this).prependTo('#comp_player #comp_area');
                var $selfAndSiblings = $(this).siblings().andSelf();
                that.preFilteringOfCreateArray($selfAndSiblings);          
       });
       //RUMMY.events.flipCards('comp', $lastInDeck);
    }
    
    
    
}

//RUMMY.computerPlayer.events.createNewArray
	
$(document).ready(function () {
	RUMMY.createarrayofcards();
	RUMMY.fillinmaincontent()
	RUMMY.loopthroughdiv()
	
	//events
	RUMMY.events.dealcards()
	RUMMY.events.reshuffle()
}); // end document.ready

				










