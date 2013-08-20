(function($){
    $.fn.removeStyle = function(style){
        var search = new RegExp(style + '[^;]+;?', 'g');
        return this.each(function(){
            $(this).attr('style', function(i, style){
                return style.replace(search, '');
            });
        });
    };
}(jQuery));
var GAME = GAME || {};
var one_suit = {
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
var each_suit = ['spades', 'clubs', 'hearts', 'diamonds'];
var deckofcards = {}
for (i=0, len = each_suit.length; i < len; i++) {
	deckofcards[each_suit[i]] = Object.create(one_suit);
}
var whole_deck = [];
var card_value = {};
var second_key ='';
var suit_object = '';
GAME.takeCard = "take";
GAME.discard = "discard";


GAME.createarrayofcards = function (callcreatehtmldeck){
	whole_deck = [];
	for (key in deckofcards) {
		suit_object = deckofcards[key]; // {hearts, diamonds, clubs, spades }
		var suit = suit_object;	
		for (second_key in suit) {	     //second_key is ace, two, three, etc    
			whole_deck.push(second_key + ' of ' + key + ' ' + suit[second_key])
			//console.log(whole_deck);
		} 		
	}
	whole_deck = whole_deck.sort(function() {return 0.5 - Math.random()})
	if (callcreatehtmldeck === true) {
		
		GAME.fillinmaincontent();
		GAME.loopthroughdiv();
		GAME.events.dealcards();
    }
}

GAME.createhtmlDeck = function (whole_deck) {
    each_suit = each_suit.sort(function() {return 0.5 - Math.random()})
    var html = '<section id="deck">';
    var eachsuitlength = each_suit.length;
    var wholedecklength = whole_deck.length;
    for (i=0; i < wholedecklength; i++) {
            for (j=0; j<eachsuitlength; j++) {
                if (whole_deck[i].match(each_suit[j])) {
					html += '<section class="wrapper"><div class='+each_suit[j]+'>' + whole_deck[i] + '</div><div class="back"></div></section>';
				} 
			} // end inner for loop
    }
    html += '</section>';
    return html;
}

GAME.fillinmaincontent = function() {
	var main_content = document.getElementById('main_content');
	main_content.innerHTML = this.createhtmlDeck(whole_deck); // creates the deck
	var buttons = '<article><button id="deal">dealcards</button> <button disabled id="reshuffle">reshuffle</button> </article>'; 
	$(main_content).append(buttons);
}


GAME.loopthroughdiv = function () {
	var html_text;
	var html_text_num;
	$('#deck div').not('.back').each(function (i) { 
		html_text = $(this).text();
		html_text_num = html_text.substr(html_text.length - 2);
		var space = html_text.split(" ")
		$(this).attr('data-value', $.trim(html_text_num)).addClass(space[0]);
		$(this).parent().css({top:1+i, left:1+i, zIndex: 1+i});
		$(this).html(function() {
			var last = space.pop();
			var new_html = "<p>" + space.join(" ") + "</p><a href='#'>" + GAME.discard + "</a><span>"+last+"</span>";
			return new_html;
		});
	});
}

GAME.events =  {
	dealcards: function () {
		var deal = document.getElementById('deal');
		$(deal).click(function () {
			var j = 1, k = 1, i = 52;
			//check these values on second call of deal cards  and k as well console log those bitches
			var refreshIntervalId = setInterval(function() {                     
				k = 50 + k;
				if (i % 2 ==1) {
					$('#deck').children().eq(i).addClass('player temp').css({'-webkit-transform': 'translateX('+(k-50)+'px)','transform':'translateX('+(k-50)+'px)' }).removeStyle('top').removeStyle('z-index') // player one
					} else {
					$('#deck').children().eq(i).addClass('comp_player temp').css({left: k-50, 'top': '-185px'}) // computer player
				}

				i = i-1
     
				if (i < 32) {              
				
				GAME.events.flipCards('player', $('#deck .player'));
				GAME.events.flipCards('comp', $('#deck .comp_player'))
				clearInterval(refreshIntervalId)
				}
			}, 300) // end setInterval	
		});	
	},
	
	flipCards: function (which_one, object) {
		if (which_one === 'player') {
			var that = this;
			object.removeClass('temp')
			setTimeout(function () {
				var top_pos = object.position().top
				top_pos = top_pos-40; // because of min-height on main content div
				var left = object.parent().offset().left
				$('#player').css({position:'relative', top:-top_pos, marginLeft:(left-28)})
				object.appendTo('#player #area')
				setTimeout(function() {
                    object.removeAttr('style').addClass('flipchild').children('div').addClass('flip').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() { $(object).addClass('remove_transition_duration') });
                    that.switchitupyo();	
				}, 1000);
				that.playerHover(object);

			}, 4000);
			
		} else {
			$(object).removeClass('temp')
            setTimeout(function () {
                var top_pos = object.position().top
				top_pos = top_pos -15; // because of min-height on main content div
				var left = $(object).parent().offset().left
				$('#comp_player').css({position:'relative', top:-top_pos, marginLeft:(left -8)})
				$(object).appendTo('#comp_player #comp_area')
            }, 4000);
     } // end else statement
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
		})
        $('#reshuffle').removeAttr('disabled')
		this.reshuffle();
		this.dealfirstcard();
		
	},
	
	reshuffle: function () {
		var reshuffle = document.getElementById('reshuffle');
		$(reshuffle).click(function() {
			main_content.innerHTML = '';
			$('#player #area, #comp_player #comp_area').empty().parent().removeAttr('style');
			GAME.createarrayofcards(true);
		})
	},
	
	dealfirstcard: function () {
		var deck = $('#deck').get(0) // get last child fix this 3/29
		deck = deck.lastElementChild;
		$(deck).addClass('showdacard').on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
				$(this).addClass('flipit').children('div').addClass('flipit takeCard').find('a').text(GAME.takeCard);
		})

		var takeCard = $("<button id='takeCard'>Take from deck</button>");
		takeCard.appendTo('article');
		this.takeNextCard($(deck), takeCard);
		this.playerHover($(deck));
	},
	
	playerHover: function (obj) {
		console.log(obj);
		var discard = obj.find('a');
		obj.hover(function () {
			$(this).find('a').addClass('discard');
		}, function () {
			$(this).find('a').removeClass('discard');
		});
		this.discard(discard, obj);
	},
	
	discard: function (discard, obj) {
		var howManyCards = obj.siblings().length;
		discard.on('click', function (ev) {
			if (howManyCards < 11) {
			
			}
			
		});
	},
	
	takeNextCard: function (deck, button) {
	    button.on('click', function (ev) {
			deck.prev().prependTo('#area');
		
		});
	
	}
	
} // end GAME.events



	
$(document).ready(function () {
	GAME.createarrayofcards();
	GAME.fillinmaincontent()
	GAME.loopthroughdiv()
	
	//events
	GAME.events.dealcards()
	GAME.events.reshuffle()
}); // end document.ready

				







