import React from 'react'

class ImageSizeRow extends React.Component {
	constructor(props) {
		super(props)


	}



	render() {
		let sizeInputs = this.props.sizeInputs.map((size, i) => {
			return (
				{/*<div className="sizeInput__row" key={i}>
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
				</div>*/}
			)
		})
		return (
			<div className="sizeInput">
				{sizeInputs}
			</div>
		)
	}
}

ImageSizeRow.propTypes = {
	sizeInputs: React.PropTypes.array,
	addSizeRow: React.PropTypes.func,
	removeSizeRow: React.PropTypes.func,
	resetSizes: React.PropTypes.func,
	handleWidthChange: React.PropTypes.func,
	handleHeightChange: React.PropTypes.func,
}

export default ImageSizeRow