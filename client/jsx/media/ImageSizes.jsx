import React from 'react'

class ImageSizes extends React.Component {
	constructor() {
		super()

		this.state = {
			sizeInputs: [{ height: '', width: '' }]
		}

		this.handleWidthChange = this.handleWidthChange.bind(this)
		this.handleHeightChange = this.handleHeightChange.bind(this)
	}

	handleHeightChange(e) {
		e.persist()
		const sizeIndex = e.target.dataset.sizeIndex
		this.props.handleHeightChange(e.target.value, sizeIndex)
	}

	handleWidthChange(e) {
		e.persist()
		const sizeIndex = e.target.dataset.sizeIndex
		this.props.handleWidthChange(e.target.value, sizeIndex)
	}

	componentWillReceiveProps (nextProps) {
		this.setState({sizeInputs: nextProps.sizeInputs})
	}

	render() {
		let sizeInputs = this.props.sizeInputs.map((size, i) => {
			return (
				<div className="sizeInput__row" key={i}>
					<input 
					type="number"
					name="width"
					className="sizeInput__input"
					data-size-index={i}
					onChange={this.handleWidthChange}
					value={this.state.sizeInputs[i].width} />

					<span className="sizeInput__spacer"> x </span>

					<input 
					type="number" 
					name="height"
					data-size-index={i}
					className="sizeInput__input"
					onChange={this.handleHeightChange}
					value={this.state.sizeInputs[i].height} />
				</div>
			)
		})
		return (
			<div className="sizeInput">
				<button className="sizeInput__counter" onClick={this.props.addSizeRow}>+</button>
				<button className="sizeInput__counter" onClick={this.props.removeSizeRow}>-</button>
				<button className="sizeInput__reset" onClick={this.props.resetSizes}>Clear</button>
				{sizeInputs}
			</div>
		)
	}
}

ImageSizes.propTypes = {
	sizeInputs: React.PropTypes.array,
	addSizeRow: React.PropTypes.func,
	removeSizeRow: React.PropTypes.func,
	resetSizes: React.PropTypes.func,
	handleWidthChange: React.PropTypes.func,
	handleHeightChange: React.PropTypes.func,
}

export default ImageSizes