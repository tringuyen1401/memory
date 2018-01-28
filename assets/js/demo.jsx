import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<Demo side={0}/>, root);
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      side: props.side,
      cards: [ 
        {value: "A", flipped: false, matched: false},
        {value: "B", flipped: false, matched: false},
        {value: "C", flipped: false, matched: false},
        {value: "D", flipped: false, matched: false},
        {value: "E", flipped: false, matched: false},
        {value: "F", flipped: false, matched: false},
        {value: "G", flipped: false, matched: false},
        {value: "H", flipped: false, matched: false},
        {value: "A", flipped: false, matched: false},
        {value: "B", flipped: false, matched: false},
        {value: "C", flipped: false, matched: false},
        {value: "D", flipped: false, matched: false},
        {value: "E", flipped: false, matched: false},
        {value: "F", flipped: false, matched: false},
        {value: "G", flipped: false, matched: false},
        {value: "H", flipped: false, matched: false},
      ],
      flip: [],
      first: null,
      done: 0,
      clicked: 0};
  }

  shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  handleClick(e, id) {
    var input = e.target;
    var cards = this.state.cards;
    var flip = this.state.flip;
    var first = this.state.first;
    var done = this.state.done;
    var clicked = this.state.clicked;
    if (flip.length < 1) {
      flip.push(cards[id]);
      first = id;
      cards[id].flipped = true;
      this.setState({ cards: cards, flip: flip, first: first, done: done, clicked: clicked + 1});
    } else if (flip.length == 1) {
      var firstCard = flip[0].value;
      if (firstCard == cards[id].value) {
        cards[first].matched = true;
        cards[first].flipped = true;
        cards[id].matched = true;
        done += 2;
      }
      flip.push(cards[id]);
      cards[id].flipped = true;
      this.setState({cards: cards, first: null, done: done, clicked: clicked + 1});
      setTimeout(() => {
        var cards = this.state.cards;
        cards = _.map(cards, (card, ii) => {
          if (!card.matched) {
            card.flipped = false;
          }
          return card;
        });
        this.setState({cards: cards, flip: []}, this.checkBoard);
      }, 500);
    }
  }

  checkBoard() {
    var done = this.state.done;
    var cards = this.state.cards;
    if (done >= 16) {
      alert("Board cleared! Generating new board!")
      this.reset();
    }
  }

  reset() {
    var cards = this.state.cards;
    cards = this.shuffle(cards).map((card) => {
      card.flipped = false;
      card.matched = false;
      return card;
    });
    this.setState({cards: cards, done: 0, flip: [], first: null, clicked: 0});
  }

  restartGame(e) {
    this.reset();
  }  

  render() {
    return (
      <div className="row">
        <Button className="side col" onClick={this.restartGame.bind(this)}>Restart!</Button>
        <div className="col-6">
          <span className="score">Score:{this.state.clicked}</span>
        </div>
        <div className="col">
          &nbsp;
        </div>
        <Board cards={this.state.cards} handleClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}

function Board(params) {
  let cards = params.cards
  let cardsSet = _.map(cards, (card, ii) => {
    return <Card id={ii} card={card} key={ii} handleClick={params.handleClick}/>;
  });
  return (
    <div className="board">
      {cardsSet}
    </div>
  );

}

function Card(params) {
  let text = params.card.flipped? params.card.value : "?"
  text = params.card.matched? "✓" : text
  let id = params.id
  function cardClicked(e) {
    params.handleClick(e, id);
  }

  return (
    <div id={id} className="card" onClick={cardClicked}>
      {text}
    </div>
  );
}
