"use strict"

// A clickable cell
function Cell(props) {
	let class_name = "cell ";
	if (props.live)
	{
		class_name += "live";
	} else {
		class_name += "dead";
	}

	return(
		<button className={class_name} onClick={ props.onClick }>
			{props.value}
		</button>
	)
}

class Grid extends React.Component {
	constructor(props) {
		super(props);

		this.width = 4;
		this.height = 4;
	}

	render() {
		let buttons = [];
		for (let i = 0; i < this.height; ++i)
		{
			let row = [];
			for (let j = 0; j < this.width; ++j)
			{
				row.push(<Cell key={i * this.width + j} live={(i + j) % 2} onClick={()=>this.props.onClick()} />);
			}

			buttons.push(<div key="i" className="grid-row" children={row}/>);
		}

		return buttons;
	}
}

ReactDOM.render(<Grid />, document.getElementById('root'));