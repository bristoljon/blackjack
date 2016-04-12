
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

  var fix = document.createElement('div');
  document.body.appendChild(fix);

  beforeEach( () => {

    fix.innerHTML = '';

    ['player','dealer'].forEach( player => {
      var el = document.createElement('div');
      el.setAttribute('id',player);
      ['score','status'].forEach( classname => {
        var div = document.createElement('div');
        div.setAttribute('class', classname);
        el.appendChild(div);
      })
      fix.appendChild(el);
    });

    ['stick','hit','start'].forEach( btn => {
      var el = document.createElement('input');
      el.setAttribute('type', 'button');
      el.setAttribute('id', btn);
      fix.appendChild(el);
    });

    var el = document.createElement('div');
    el.setAttribute('id', 'status');
    fix.appendChild(el);

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

    xit('has a status property to store current status of game', () => {
      expect(Blackjack.status).toBe('Your Turn');
    });

    it('status property auto updates DOM on change', () => {
      Blackjack.status = 'HELLO';
      var stat = document.getElementById('status');
      expect(stat.innerHTML).toBe('HELLO');
    });

  });

  describe('Player', () => {
    it('has a name property', () => {
      expect(Blackjack.player.name).toBeDefined();
    });
    it('has a hand property', () => {
      expect(Blackjack.player.hand).toBeDefined();
    });
    it('has an element property with a ref to the dom el', () => {
      expect(Blackjack.player.el).toBeDefined();
    });
    it('has a status property that automatically updates the DOM when changed', () => {
      Blackjack.player.status = 'HELLO';
      var status = Blackjack.player.el.getElementsByClassName('status')[0];
      expect(status.innerHTML).toBe('HELLO')
    });
    it('has a score property that automatically updates the DOM when changed', () => {
      Blackjack.player.score = '3';
      var status = Blackjack.player.el.getElementsByClassName('score')[0];
      expect(status.innerHTML).toBe('3')
    });
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

      Blackjack.deal(Blackjack.player);
      expect(Blackjack.player.hand.length).toBe(1);
      expect(Blackjack.deck.length).toBe(51);
    });

    it("Appends card elements to that player's div element", () => {
      var cards = Blackjack.player.el.getElementsByClassName('card');
      expect(cards.length).toBe(0);
      Blackjack.deal(Blackjack.player);
      expect(cards.length).toBe(1);
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

    it('removes all card elements from dom on restart', () => {
      Blackjack.start();
      var cards = document.getElementsByClassName('card');
      expect(cards.length).toBe(3);

      Blackjack.start();
      cards = document.getElementsByClassName('card');
      expect(cards.length).toBe(3);
    })
  });

  describe('Gameplay', () => {
    it('starts by dealing 2 cards to the player and 1 to dealer', () => {
      Blackjack.start();
      expect(Blackjack.player.hand.length).toBe(2);
      expect(Blackjack.dealer.hand.length).toBe(1);
      expect(Blackjack.deck.length).toBe(49);
    });

    it('allows the player to hit', () => {
      Blackjack.deal(Blackjack.player);
      expect(Blackjack.player.hand.length).toBe(1);
    });

    xit('alerts the player when bust', () => {
      while (Blackjack.player.hand.total() < 21) {
        Blackjack.deal(Blackjack.player);
      }
      var status = Blackjack.player.el.getElementsByClassName('status')[0];
      expect(status.innerHTML).toBe('BUST');
    });

    it('deals the dealer until she has a higher or equal score or goes bust', () => {
      Blackjack.start();
      Blackjack.stick().then( () => {
        expect(Blackjack.status).toBe('Game Over');
        if (Blackjack.player.hand.total() > Blackjack.dealer.hand.total()) {
          expect(Blackjack.player.status).toBe('WINNER');
          expect(Blackjack.player.score).toBe(1)
        }
        else {
          expect(Blackjack.player.status).toBe('LOSER')
          expect(Blackjack.player.score).toBe(0)
        }
      })
    });

    it('prevents the user hitting or sticking if game status is COMPLETE', () => {
      Blackjack.start();
      Blackjack.stick().then( () => {
        var cards = document.getElementsByClassName('card');
        expect(Blackjack.status).toBe('COMPLETE');
        Blackjack.deal(Blackjack.player);
        var now = document.getElementsByClassName('card');
        expect(cards.length).toBe(now.length);
      })
    });

  });

  describe('Hand Scoring', () => {

    var ace = {suit: 'hearts', value: 'A'},
        king = {suit: 'hearts', value: 'K'},
        eight = {suit: 'hearts', value: 8},
        two = {suit: 'hearts', value: 2};

    it('A/K === 21', () => {
      Blackjack.player.hand = [ace, king];
      expect(Blackjack.player.hand.total()).toBe(21);
    });

    it('K === 10', () => {
      Blackjack.player.hand = [king];
      expect(Blackjack.player.hand.total()).toBe(10);
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

})
