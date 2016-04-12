
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

describe('Blackjack', () => {

  beforeEach( () => {
    var el = document.createElement('div');
    el.setAttribute('id','player');
    document.body.appendChild(el);

    el = document.createElement('div');
    el.setAttribute('id','dealer');
    document.body.appendChild(el);

    Blackjack.init()
  });

  describe('Components', () => {

    it('Has a deck array', () => {
      expect(typeof Blackjack.deck).toBe('object');
    })

    it('Has a player object with a hand array', () => {
      expect(typeof Blackjack.player.hand).toBe('object');
    })

    it('Has a dealer object with a hand array', () => {
      expect(typeof Blackjack.dealer.hand).toBe('object')
    })

  });

  describe('Deck', () =>{

    var suits = ['hearts','diams','spades','clubs'],
        vals = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];

    it('Generates a deck containing 52 cards', () => {
      var deck = Blackjack.deck;
      expect(deck.length).toBe(52);
    });

    it('Contains every card from each suit', () => {
      var deck = Blackjack.deck;
      suits.forEach(function (suit) {
        vals.forEach(function (val) {
          var card = {suit: suit, value: val};
          expect(deck.has(card)).toBe(true)
        })
      })
    });

    it('can shuffle the cards', () => {
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

  describe('Dealing', () => {

    it('has a method for dealing cards from the deck', () => {
      expect(Blackjack.deck.length).toBe(52);
      expect(Blackjack.player.hand.length).toBe(0);

      Blackjack.deal(Blackjack.player, 1);
      expect(Blackjack.player.hand.length).toBe(1);
      expect(Blackjack.deck.length).toBe(51);
    });

    it('re/starts by returning dealt cards to the bottom of the deck', () => {
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

  describe('Gameplay', () => {
    it('starts by dealing 2 cards to the player and 1 to dealer', () => {
      Blackjack.start();
      expect(Blackjack.player.hand.length).toBe(2);
      expect(Blackjack.dealer.hand.length).toBe(1);
      expect(Blackjack.deck.length).toBe(49);
    });

    it('detects if a player has blackjack / natural'. () => {
      var ace = {suit: 'hearts', value: 'A'},
          king = {suit: 'hearts', value: 'K'};
      Blackjack.player.hand = [ace, king];
    })
  });

  describe('Scoring', 90 => {

    var ace = {suit: 'hearts', value: 'A'},
        king = {suit: 'hearts', value: 'K'},
        eight = {suit: 'hearts', value: 8},
        two = {suit: 'hearts', value: 2};

    it('A/K === 21', () => {
      Blackjack.player.hand = [ace, king];
      expect(Blackjack.player.hand.total()).toBe(21);
    });

    it('A/K/A === 12', () => {
      Blackjack.player.hand = [ace, king, ace];
      expect(Blackjack.player.hand.total()).toBe(12);
    });

    it('A/A === 12', () => {
      Blackjack.player.hand = [ace, ace];
      expect(Blackjack.player.hand.total()).toBe(12);
    });

    it('A/A/A === 13', () => {
      Blackjack.player.hand = [ace, ace, ace];
      expect(Blackjack.player.hand.total()).toBe(13);
    });

    it('A/A/A/8 === 21', () => {
      Blackjack.player.hand = [ace, ace, ace, eight];
      expect(Blackjack.player.hand.total()).toBe(21);
    });

    it('8/2/A === 21', () => {
      Blackjack.player.hand = [eight, two, ace];
      expect(Blackjack.player.hand.total()).toBe(21);
    });

    it('8/2/A/8 === 21', () => {
      Blackjack.player.hand = [eight, two, ace, eight];
      expect(Blackjack.player.hand.total()).toBe(19);
    });

  })


  // describe('UI', () => {
  //
  //   var start = document.getElementById('startgame');
  //
  //   it('has a new game button', function() {
  //     expect(start).toBeTruthy();
  //   })
  //
  //   it("clicking the 'New Game' triggers Blackjack.init()", () => {
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
