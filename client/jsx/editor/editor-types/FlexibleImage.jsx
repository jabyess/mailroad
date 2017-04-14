import React from 'react'
import autoBind from 'react-autobind'

class FlexibleImage extends React.Component {
	constructor() {
		super()

		autoBind(this,
			'showGallery',
			'getImageMeta',
			'removeImage'
		)
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.imageURL !== nextProps.imageURL && this.props.imageIndex === this.props.index) {
			const content = this.props.content
			
			this.getImageMeta(nextProps.imageURL, (height, width) => {
				content.push({imageURL: nextProps.imageURL, height, width})
				this.props.updateContentValue(content, this.props.index)
			})
			
			
		}
		console.log(nextProps)
	}

	getImageMeta(imageURL, cb) {
		let img = new Image()
		img.addEventListener('load', function() {
			cb(this.height, this.width)
		})
		img.src = imageURL

	}

	showGallery(e) {
		e.preventDefault()
		this.props.setImageIndex(this.props.index)

		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageGalleryModalVisible'
		})
		window.dispatchEvent(isImageGalleryModalVisible)
	}

	removeImage() {
		let content = this.props.content
		content.pop()
		this.props.updateContentValue(content, this.props.index)
	}

	render() {
		const addButtonDisabled = this.props.content.length >= 3 ? true : ''
		const removeButtonDisabled = this.props.content.length === 0 ? true : ''
		return(
			<div className="flexibleImage box">
				<div className="flexibleImage__titleContainer">
					<h1 className="title">Flexible Image</h1>
				</div>

				<select name="componentTitle" className="select" value={this.props.componentTitle} onChange={this.onTitleChange}>
					{this.props.componentTitles.map((title, i) => {
						return <option key={i} value={title.title}>{title.title}</option>
					})}
				</select>

				<button className="button" disabled={addButtonDisabled} onClick={this.showGallery}>Add Image</button>
				<button className="button" disabled={removeButtonDisabled} onClick={this.removeImage}>Remove Image</button>

				<div className="flexibleImage__imageContainer">
					{this.props.content.map((img, i) => {
						return (
							<div className="flexibleImage__imageContainer__image card" key={img.imageURL}>
								<div className="card-image">
										<img key={i} src={img.imageURL} className="image" alt=""/>
								</div>
								<div className="card-content">
									<div className="panel">
										<div className="panel-heading">Attributes</div>
										<div className="panel-block">Width: {img.width}px</div>
										<div className="panel-block">Height: {img.height}px</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

FlexibleImage.propTypes = {
	setImageIndex: React.PropTypes.func,
	index: React.PropTypes.number

}

export default FlexibleImage