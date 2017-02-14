
import React from 'react'

class ImageSizes extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			sizeInputs: props.sizeInputs
		}

		this.handleWidthChange = this.handleWidthChange.bind(this)
		this.handleHeightChange = this.handleHeightChange.bind(this)
		this.handleAddSizeRow = this.handleAddSizeRow.bind(this)
		this.handleRemoveSizeRow = this.handleRemoveSizeRow.bind(this)
	}

	handleAddSizeRow(e) {
		const imageIndex = e.target.dataset.imageIndex
		this.props.addSizeRow(imageIndex)
	}

	handleRemoveSizeRow(e) {
		const imageIndex = e.target.dataset.imageIndex
		this.props.removeSizeRow(imageIndex)

	}

	handleHeightChange(e) {
		e.persist()
		const sizeIndex = e.target.dataset.sizeIndex
		const imageIndex = e.target.dataset.imageIndex
		this.props.handleHeightChange(e.target.value, imageIndex, sizeIndex)
	}

	handleWidthChange(e) {
		e.persist()
		const sizeIndex = e.target.dataset.sizeIndex
		const imageIndex = e.target.dataset.imageIndex
		this.props.handleWidthChange(e.target.value, imageIndex, sizeIndex)
	}

	componentWillReceiveProps (nextProps) {
		this.setState({sizeInputs: nextProps.sizeInputs})
	}

	render() {
		const imageSizes = this.props.sizeInputs.map((size, imageIndex) => {
			return (
				<div className="imageSizes" key={imageIndex}>
					<button className="sizeInput__counter" data-image-index={imageIndex} onClick={this.handleAddSizeRow}>+</button>
					<button className="sizeInput__counter" data-image-index={imageIndex} onClick={this.handleRemoveSizeRow}>-</button>
					{size.map((size, sizeIndex) => {
						return (
							<div className="sizeInput__row" key={sizeIndex}>
								<input 
								type="number"
								name="width"
								className="sizeInput__input"
								data-image-index={imageIndex}
								data-size-index={sizeIndex}
								onChange={this.handleWidthChange}
								value={this.state.sizeInputs[imageIndex][sizeIndex].width} />

								<span className="sizeInput__spacer"> x </span>

								<input 
								type="number" 
								name="height"
								data-image-index={imageIndex}
								data-size-index={sizeIndex}
								className="sizeInput__input"
								onChange={this.handleHeightChange}
								value={this.state.sizeInputs[imageIndex][sizeIndex].height} />
							</div>
						)
					})}
				</div>
			)
		})
		return <div>{imageSizes}</div>
	}
}

ImageSizes.propTypes = {
	sizeInputs: React.PropTypes.array,
	addSizeRow: React.PropTypes.func,
	removeSizeRow: React.PropTypes.func,
	handleWidthChange: React.PropTypes.func,
	handleHeightChange: React.PropTypes.func,
}

export default ImageSizes
