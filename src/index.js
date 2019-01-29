import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//function component
function Square(props) {
	return (
		<button
			className="square"
			onClick={() => props.onClick()}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (<Square
			value={this.props.squares[i]} 			// receive a squares via props and pass a squares
			onClick={() => this.props.onClick(i)}	// <Square /> can call when clicked
		/>);
	}

	render() {
		return (
			<div>
				<div className="board-row">
					{this.renderSquare(0)}
					{this.renderSquare(1)}
					{this.renderSquare(2)}
				</div>
				<div className="board-row">
					{this.renderSquare(3)}
					{this.renderSquare(4)}
					{this.renderSquare(5)}
				</div>
				<div className="board-row">
					{this.renderSquare(6)}
					{this.renderSquare(7)}
					{this.renderSquare(8)}
				</div>
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);

		// initial state
		this.state = {
			history: [{ squares: Array(9).fill(null) }], 	// Default squares
			xIsNext: true,	// 	x start
			stepNumber: 0
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();	// Copy current.squares to new array every click

		// ignoring a click if someone has won the game or if a Square is already filled:
		if (squares[i] || calculateWinner(squares)) {
			return;  //Stop a loop (end function)
		} else {
			squares[i] = this.state.xIsNext ? 'X' : 'O'; // X start
		}

		// Update state
		this.setState({
			history: history.concat([{ squares: squares }]), // concat array to new array, not mutate original array
			xIsNext: !this.state.xIsNext,
			stepNumber: history.length,	// more than actual step 1
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step%2) === 0,	// 	event step --> xIsNext = True
		});
	}

	render() {
		let history = this.state.history;
		let current = history[this.state.stepNumber]; //last square in history

		let status;
		const winner = calculateWinner(current.squares); // X, O, Null

		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		// for each loop
		const moves = history.map( (step, move) => { 	// step is square		// move is index (start=0)
			const description = move ? 'Go to move #' + move : 'Go to game start';

			// link jump to each move#
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{description}</button>
				</li>
			);
		});

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function calculateWinner(squares) {
	// Winner line pattern
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		let [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]; //win
		}
	}

	return null; // no one win
}
