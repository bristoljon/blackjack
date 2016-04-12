Array.prototype.shuffle = function () {
  var counter = this.length,
      ar = [],
      self = this;
  while (counter) {
    ar.push(self.splice(Math.floor(Math.random()*counter--), 1)[0]);
  }
  return ar
};

// Method for calculating hand scores from array of cards
Array.prototype.total = function () {
  var mintotal = 0,
      aces = false;
  this.forEach( card => {
    if (typeof card.value === 'number') mintotal += card.value
    else if (card.value === 'A') {
      mintotal += 1;
      aces = true;
    }
    else mintotal += 10
  });
  if (aces && mintotal < 12) return mintotal + 10;
  return mintotal;
}

var Blackjack = {

  Player: function (name, el) {
    this.name = name;
    this.score = 0;
    this.hand = [];
    this.el = el;
    this.status = '';
    return new Proxy(this, {
      set: function (target, property, value) {
        if (property === 'status' || property === 'score') {
          target.el.getElementsByClassName(property)[0].innerHTML = value
        }
        target[property] = value
      }
    })
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

  set status(x) {
    document.getElementById('status').innerHTML = x;
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
  },

  init: function () {
    this.deck = this.makeDeck().shuffle();
    this.player = new this.Player('anon', document.getElementById('player'));
    this.dealer = new this.Player('Dealer', document.getElementById('dealer'));
    this.status = 'Ready';
  },

  start: function () {
    this.status = 'Your Turn';
    this.player.status = '';
    this.dealer.status = '';
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
    if (this.status !== 'Game Over') {
      var self = this,
          card = self.deck.pop();
      player.hand.push(card);
      player.el.appendChild(card.render());
      if (player.hand.total() > 21) {
        this.bust(player);
        return true;
      }
      return false
    }
  },

  stick: function () {
    if (this.status !== 'Game Over') {
      this.status = 'Dealers Turn';
      return new Promise( (resolve, reject) => {
        this._timer = window.setInterval( () => {
          if (this.dealer.hand.total() < this.player.hand.total() ) {
            if (this.deal(this.dealer)) {
              resolve();
            }
          }
          else {
            resolve();
            this.win(this.dealer);
          }
        }, 2000);
      }).then( () => { window.clearInterval(this._timer); })
    }
  },

  bust: function (player) {
    window.clearInterval(this._timer);
    player.status = 'BUST';
    this.status = 'Game Over';
    if (player.name !== 'Dealer') {
      this.dealer.score++
    }
    else {
      this.player.score++
    }
  },

  win: function (player) {
    this.status = 'Game Over';
    player.status = 'WIN';
    player.score++
  },

  addEventListeners: function () {
    document.getElementById('start').addEventListener('click', Blackjack.start.bind(Blackjack));
    document.getElementById('hit').addEventListener('click', () => {
      Blackjack.deal(Blackjack.player);
    });
    document.getElementById('stick').addEventListener('click', Blackjack.stick.bind(Blackjack));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Blackjack.addEventListeners();
  Blackjack.init();
})
