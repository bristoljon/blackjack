/*
Card Array
array.shuffle
player
dealer
hand
compare
*/

// Helper method for checking presense of card in selection
Array.prototype.has = function (target) {
  var found = false
  this.forEach( function (card) {
    if (card.suit === target.suit && card.value === target.value) {
      found = true
    }
  })
  return found
}

describe('Blackjack', function () {

  beforeEach( function () {
    var el = document.createElement('div');
    el.setAttribute('id','player');
    document.body.appendChild(el);

    el = document.createElement('div');
    el.setAttribute('id','dealer');
    document.body.appendChild(el);

    Blackjack.init()
  });

  describe('Components', function () {

    it('Has a deck array', function () {
      expect(typeof Blackjack.deck).toBe('object');
    })

    it('Has a player object with a hand array', function () {
      expect(typeof Blackjack.player.hand).toBe('object');
    })

    it('Has a dealer object with a hand array', function () {
      expect(typeof Blackjack.dealer.hand).toBe('object')
    })

  });

  describe('Deck', function (){

    var suits = ['hearts','diams','spades','clubs'],
        vals = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];

    it('Generates a deck containing 52 cards', function () {
      var deck = Blackjack.deck;
      expect(deck.length).toBe(52);
    });

    it('Contains every card from each suit', function () {
      var deck = Blackjack.deck;
      suits.forEach(function (suit) {
        vals.forEach(function (val) {
          var card = {suit: suit, value: val};
          expect(deck.has(card)).toBe(true)
        })
      })
    });

    it('can shuffle the cards', function () {
      var deck = Blackjack.deck,
          unchanged = 0,
          shuffled = deck.shuffle();

      for (var i = 0; i < deck.length; i++) {
        if (deck[i].num === shuffled[i].num &&
            deck[i].suit === shuffled[i].suit) {
          unchanged ++;
        }
      }
      expect(unchanged).toBeLessThan(15);
    });

    it('can render any given card as a div element with .card class', () => {
      var card = Blackjack.deck[0],
          el = card.render();
      expect(el.classList[0]).toBe('card');
    });
  });

  describe('Dealing', function () {

    it('has a method for dealing cards from the deck', function () {
      expect(Blackjack.deck.length).toBe(52);
      expect(Blackjack.player.hand.length).toBe(0);

      Blackjack.deal(Blackjack.player, 1);
      expect(Blackjack.player.hand.length).toBe(1);
      expect(Blackjack.deck.length).toBe(51);
    });

    it('re/starts by returning dealt cards to the bottom of the deck', function () {
      Blackjack.start();
      var dealt = Blackjack.player.hand.concat(Blackjack.dealer.hand);

      Blackjack.start();

      // Get the first / bottom 4 elements of the deck
      var bottom = Blackjack.deck.splice(0, 3);
      dealt.forEach( function (card) {
        expect(bottom.has(card)).toBe(true)
      })
    })
  });

  describe('Gameplay', function () {
    it('starts by dealing 2 cards to the player and 1 to dealer', function () {
      Blackjack.start();
      expect(Blackjack.player.hand.length).toBe(2);
      expect(Blackjack.dealer.hand.length).toBe(1);
      expect(Blackjack.deck.length).toBe(49);
    });

    it('detects if a player has blackjack / natural'. function () {
      var ace = {suit: 'hearts', value: 'A'},
          king = {suit: 'hearts', value: 'K'};
      Blackjack.player.hand = [ace, king];
    })
  })


  // describe('UI', function () {
  //
  //   var start = document.getElementById('startgame');
  //
  //   it('has a new game button', function() {
  //     expect(start).toBeTruthy();
  //   })
  //
  //   it("clicking the 'New Game' triggers Blackjack.init()", function () {
  //
  //     spyOn(Blackjack, 'init').and.callThrough();
  //
  //     var evt = new MouseEvent("click", {
  //       bubbles: true,
  //       cancelable: true,
  //       view: window,
  //     });
  //     start.dispatchEvent(evt);
  //
  //     expect(Blackjack.init).toHaveBeenCalled();
  //
  //   })
  // })
})
