Array.prototype.shuffle = function () {
  var counter = this.length,
      ar = [],
      self = this;
  while (counter) {
    ar.push(self.splice(Math.floor(Math.random()*counter--), 1)[0]);
  }
  return ar
};

Array.prototype.total = function () {
  var total = 0;
  this.forEach( card => {
    if (typeof card.value === 'number') total += card.value
    else if (card.value === 'A') total += 1
    else total += 10
  })
  return total;
}

var Blackjack = {

  Player: function (name, el) {
    this.name = name;
    this.score = 0;
    this.hand = [];
    this.el = el;
  },

  // Card constructor function
  Card: function (suit, val) {
    this.suit = suit;
    this.icon = '&' + suit + ';' ;
    this.value = val;

    this.render = facedown => {
      var el = document.createElement('div');
      el.classList.add('card');
      el.innerHTML = '<span>' + this.value + this.icon + '</span>';
      if (this.suit === 'hearts' || this.suit === 'diams') {
        el.style.color = 'red'
      }
      this.el = el;
      return el;
    }
  },

  init: function () {
    this.deck = this.makeDeck().shuffle();
    this.player = new this.Player('anon', document.getElementById('player'));
    this.dealer = new this.Player('Dealer', document.getElementById('dealer'));
  },

  start: function () {
    var cards = this.player.hand.concat(this.dealer.hand);
    cards.forEach( card => {
      card.el.parentNode.removeChild(card.el)
    });
    
    this.deck.unshift(...cards);

    this.dealer.hand = [];
    this.player.hand = [];

    this.deal(this.player);
    this.deal(this.dealer);
    this.deal(this.player);
  },

  // Deals a card from the deck to the named player
  deal: function (player) {
    var self = this,
        card = self.deck.pop();
    player.hand.push(card);
    player.el.appendChild(card.render());
    if (player.hand.total() > 21) this.bust(player);
  },

  // Basically just triggers dealer 'AI'
  stick: function () {
    var timer = window.setInterval( () => {
      if (Blackjack.dealer.hand.total() < Blackjack.player.hand.total()) {
        Blackjack.deal(Blackjack.dealer);
      }
      else {
        window.clearInterval(timer);
        this.win(Blackjack.dealer);
      }
    }, 2000)
  },

  bust: function (player) {
    if (player.name !== 'Dealer') {
      alert('Busted. You went over 21.');
      this.dealer.score++
    }
    else {
      alert('Dealer went bust, you win!');
      this.player.score++
    }
  },

  win: function (player) {
    if (player.name !== 'Dealer') {
      alert('You lose. The dealer out-blackjacked you');
    }
    else {
      alert('You won. You massively out blackjacked the dealer');
    }
    player.score++
  },

  // Returns an array of 52 cards
  makeDeck: function () {
    var self = this,
        deck = [],
        suits = ['hearts','diams','spades','clubs'],
        vals = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
    suits.forEach( suit => {
      vals.forEach( val => {
        deck.push(new self.Card(suit, val))
      })
    });
    return deck
  }
}

Blackjack.init();

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('start').addEventListener('click', Blackjack.start.bind(Blackjack));
  document.getElementById('hit').addEventListener('click', () => {
    Blackjack.deal(Blackjack.player);
  });
  document.getElementById('stick').addEventListener('click', Blackjack.stick.bind(Blackjack));

})
