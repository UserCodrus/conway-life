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

	return <button className={class_name} onClick={props.onClick} />;
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

// A button that controls the game
function Controller(props) {
	return <img className="icon" src={"icons/" + props.image} onClick={props.onClick}/>;
}

// The game board
class Game extends React.Component {
	constructor(props) {
		super(props);

		this.width = 128;
		this.height = 64;

		this.state = {
			generation: 0,
			history: [{
				cells: Array(this.width * this.height).fill(false)
			}]
		}
	}

	// Change cell data at the given grid index
	handleClick(i) {
		const cell_data = this.state.history[this.state.generation].cells.slice();
		cell_data[i] = !cell_data[i];

		this.setState({
			generation: 0,
			history: [{
				cells: cell_data
			}]
		});
	}

	// Process a single generation
	simulate() {
		// Make sure we haven't simulated farther than the current display
		const history = this.state.history;
		if (history.length > this.state.generation+1) {
			this.setState({
				generation: ++this.state.generation
			});
			return;
		}

		// Update grid cells
		const cells = history[this.state.generation].cells;
		let new_population = cells.slice();
		for (let y = 0; y < this.height; ++y) {
			for (let x = 0; x < this.width; ++x) {

				// Check the cells surrounding the current cell
				let neighbors = 0;
				for (let i = -1; i < 2; ++i) {
					for (let j = -1; j < 2; ++j) {
						// Ignore the current cell
						if (i != 0 || j != 0) {
							// Check only cells inside the grid
							const ix = x + i;
							const iy = y + j;
							if (ix > 0 && ix < this.width && iy > 0 && iy < this.height) {
								if (cells[iy * this.width + ix]) {
									neighbors++;
								}
							}
						}
					}
				}

				// Change cell state based on the number of neighbors
				const idx = y * this.width + x;
				if (cells[idx] === true) {
					// Kill live cells with less than two or more than three neighbors
					if (neighbors < 2 || neighbors > 3) {
						new_population[idx] = false;
					}
				} else {
					// Make a dead cell with three neighbors live
					if (neighbors === 3) {
						new_population[idx] = true;
					}
				}
			}
		}

		// Save the new state
		this.setState({
			generation: ++this.state.generation,
			history: history.concat([{
				cells: new_population
			}])
		})
	}

	// Run simulations periodically
	play() {

	}

	// Stop playing simulations
	stop() {

	}

	// Rewind one generation
	rewind() {
		this.stop();
		if (this.state.generation > 0) {
			this.setState({
				generation: --this.state.generation
			})
		}
	}

	// Return to original generation
	restart() {
		this.stop();
		this.setState({
			generation: 0
		})
	}

	// Reset the entire grid
	reset() {
		this.stop();
		this.setState({
			generation: 0,
			history: [{
				cells: Array(this.width * this.height).fill(false)
			}]
		})
	}

	render() {
		// Display the grid and controls
		const current_generation = this.state.history[this.state.generation].cells;
		return (
			<div className="game">
				<div className="grid"><Grid width={this.width} height={this.height} cells={current_generation} onClick={(i)=>this.handleClick(i)}/></div>
				<div className="control-bar">
					<Controller image="fast-backward-solid.svg" onClick={()=>this.restart()} />
					<Controller image="step-backward-solid.svg" onClick={()=>this.rewind()} />
					<Controller image="pause-solid.svg" onClick={()=>this.stop()} />
					<Controller image="play-solid.svg" onClick={()=>this.play()} />
					<Controller image="step-forward-solid.svg" onClick={()=>this.simulate()} />
					<Controller image="redo-alt-solid.svg" onClick={()=>this.reset()} />
				</div>
				<div className="generation">{this.state.generation}</div>
			</div>
		);
	}
}

ReactDOM.render(<Game />, document.getElementById('root'));