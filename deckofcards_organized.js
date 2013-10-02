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
RUMMY.deckofcards = (function () {
    var deck = {},
        i,
        len;
    for (i=0, len = RUMMY.each_suit.length; i < len; i++) {
	deck[RUMMY.each_suit[i]] = Object.create(RUMMY.one_suit);
    }
    return deck;
}()) // returns object


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
	var buttons = '<article><button id="deal">dealcards</button> <button disabled id="reshuffle">reshuffle</button> </article>'; 
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

    dealcards: function () {
      var deal = document.getElementById('deal');
      deal.addEventListener('click', function () {
            var k = 1; var i = 52;
            this.disabled = true;
            //check these values on second call of deal cards  and k as well console log those bitches
            var refreshIntervalId = setInterval(function() {                     
                    if (i % 2 === 1) {
                            $('#deck').children().eq(i).addClass('player temp').css({'-webkit-transform': 'translateX('+(k-50)+'px)','transform':'translateX('+(k-50)+'px)' }).removeStyle('top').removeStyle('z-index') // player one
                            } else {                                
                            $('#deck').children().eq(i).addClass('comp_player temp').css({left: k-50, 'top': '-185px'}) // computer player
                    }
                    k = 50 + k;
                    i = i-1
                    if (i < 32) {     //10 cards each 52-32         

                    RUMMY.events.flipCards('player', $('#deck .player'));
                    RUMMY.events.flipCards('comp', $('#deck .comp_player'));
                    clearInterval(refreshIntervalId);
                    }
            }, 300) // end setInterval	
       }, false);	
    },
	
    flipCards: function (which_one, object) {
        if (which_one === 'player') {
                var that = this;
                object.removeClass('temp');
                setTimeout(function () {
                        var top_pos = object.position().top
                        top_pos = top_pos-40; // because of min-height on main content div
                        var left = object.parent().offset().left
                        $('#player').css({position:'relative', top:-top_pos, marginLeft:(left)})                      
                        setTimeout(function() {
                            var obj = object.get().reverse();
                            $(obj).addClass('flipchild').children('div').addClass('flip').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() { 
                                $(obj).appendTo('#player #area').removeAttr('style');
                                that.switchitupyo();
                            });       	
                        }, 1000);
                }, 2000);
        }

        if (which_one ==='comp') {
               $(object).removeClass('temp')
                setTimeout(function () {
                    var top_pos = object.position().top
                    top_pos = top_pos -15; // because of min-height on main content div
                    var left = $(object).parent().offset().left;
                    $('#comp_player').css({position:'relative', top:-top_pos, marginLeft:(left)});
                    $(object).appendTo('#comp_player #comp_area');
                }, 4000);
        } // end else statement

        if (which_one === "new_card") {
                   object.removeClass('temp').prependTo('#player #area');
                   setTimeout(function () {
                     object.removeAttr('style').addClass('flipchild').children('div').addClass('flip');  
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
                $(ui.item).find('a').removeClass('discard');
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
            $(deckLastChild).removeStyle('left').addClass('showdacard').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
               $(this).addClass('flipit').children('div').addClass('flipit taketopCard').find('a').text(RUMMY.takeCard);
            })

            if (RUMMY.firstCard !== false) {
                    var takeCard = $("<button id='takeCard'>Take from deck</button>");
                    takeCard.appendTo('article');
                    RUMMY.firstCard = false;
            }
            this.takeNextCard($(deckLastChild), $('#takeCard'));

    },
	
    playerHover: function (obj) {
            var howManyCards = obj.siblings().length;
            if (howManyCards > 10) {
                var discard = obj.find('a');
                obj.hover(function () {
                        $(this).find('a').addClass('discard');
                }, function () {
                        $(this).find('a').removeClass('discard');
                });
                this.discard(discard, obj);	
            }

    },
	
    discard: function (discard, obj) {
            var howManyCards = obj.siblings().length;
            discard.on('click', function (ev) {
                if (howManyCards < 11) {

                }			
            });
    },
	
    takeNextCard: function (deckLastChild, takefromdeckbutton) {
        var that = this;
        takefromdeckbutton.on('click', function (ev) {
                var $topFromDeck = deckLastChild.prev()
                $topFromDeck.addClass('player temp').css({'-webkit-transform': 'translateX(-50px)','transform':'translateX(-50px)' })
                .removeStyle('top')
                .removeStyle('z-index')
                .on('transitionend webkitTransitionEnd', function () {
                        RUMMY.events.flipCards('new_card', $topFromDeck);
                });
                //deck.prev().removeAttr('style').addClass('player flipchild remove_transition_duration').prependTo('#area');
                //that.playerHover(deck); // fix paramter not deck but obj
        });	
    }
	
} // end RUMMY.events
	
$(document).ready(function () {
	RUMMY.createarrayofcards();
	RUMMY.fillinmaincontent()
	RUMMY.loopthroughdiv()
	
	//events
	RUMMY.events.dealcards()
	RUMMY.events.reshuffle()
}); // end document.ready

				







