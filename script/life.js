"use strict"

// A clickable cell
function Cell(props) {
	// Change the css class depending on whether the cell is live or dead
	let class_name = "cell ";
	if (props.live)
	{
		class_name += "live";
	} else {
		class_name += "dead";
	}

	return (
		<button className={class_name} onClick={ props.onClick }>
			{props.value}
		</button>
	)
}

// The cell grid
class Grid extends React.Component {
	render() {
		// Render a grid of cells with the provided width and height
		let buttons = [];
		for (let i = 0; i < this.props.height; ++i)
		{
			let row = [];
			for (let j = 0; j < this.props.width; ++j)
			{
				const index = i * this.props.width + j;
				row.push(<Cell key={index} id={index} live={this.props.cells[index]} onClick={()=>this.props.onClick(index)} />);
			}

			buttons.push(<div key={i} className="grid-row" children={row}/>);
		}

		return buttons;
	}
}

// The game board
class Game extends React.Component {
	constructor(props) {
		super(props);

		this.width = 32;
		this.height = 32;

		this.state = {
			cells: Array(this.width * this.height).fill(false)
		}
	}

	handleClick(i) {
		// Invert cell data at the given grid index
		const cell_data = this.state.cells.slice();
		cell_data[i] = !cell_data[i];
		this.setState({cells: cell_data});
	}

	render() {
		// Display the grid and controls
		return (
			<div className="game">
				<div className="grid"><Grid width={this.width} height={this.height} cells={this.state.cells} onClick={(i)=>this.handleClick(i)}/></div>
				<div className="controls">This is where the controls go</div>
			</div>
		);
	}
}

ReactDOM.render(<Game />, document.getElementById('root'));