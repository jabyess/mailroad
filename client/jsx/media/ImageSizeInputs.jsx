
import React from 'react'

class ImageSizeInputs extends React.Component {
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
		const imageSizeInputs = this.props.sizeInputs.map((size, imageIndex) => {
			return (
				<div className="imageSizeInputs__image control" key={imageIndex}>
					<button className="button is-large" data-image-index={imageIndex} onClick={this.handleAddSizeRow}>+</button>
					<button className="button is-large" data-image-index={imageIndex} onClick={this.handleRemoveSizeRow}>-</button>
					<img src={this.props.droppedFiles[imageIndex].preview} className="mediaUploadForm__img" />
					<div className="imageSizeInputs__inputWrapper">
						{size.map((size, sizeIndex) => {
							return (
								<div className="imageSizeInputs__inputRow" key={sizeIndex}>
									<input 
									type="number"
									name="width"
									className="input"
									placeholder="width"
									data-image-index={imageIndex}
									data-size-index={sizeIndex}
									onChange={this.handleWidthChange}
									value={this.state.sizeInputs[imageIndex][sizeIndex].width} />
									<span className="sizeInput__spacer"> x </span>
									<input 
									type="number" 
									name="height"
									placeholder="height"
									data-image-index={imageIndex}
									data-size-index={sizeIndex}
									className="input"
									onChange={this.handleHeightChange}
									value={this.state.sizeInputs[imageIndex][sizeIndex].height} />
								</div>
							)
						})}
					</div>
					
				</div>
			)
		})
		const buttonLabel = (this.props.droppedFiles.length === 1) ? 'Upload 1 Image' : `Upload ${this.props.droppedFiles.length} Images`
		return (
			<div>
				{imageSizeInputs}
				<div className="columns">
					<div className="column">
						<button className="button is-success is-large" type="submit" onClick={this.props.startUpload}>{buttonLabel}</button>
					</div>
				</div>
			</div>
		)
	}
}

ImageSizeInputs.propTypes = {
	sizeInputs: React.PropTypes.array,
	droppedFiles: React.PropTypes.array,
	addSizeRow: React.PropTypes.func,
	removeSizeRow: React.PropTypes.func,
	handleWidthChange: React.PropTypes.func,
	handleHeightChange: React.PropTypes.func,
}

export default ImageSizeInputs
