import React from 'react'
import PropTypes from 'prop-types'
import autoBind from 'react-autobind'

class SingleImage extends React.Component {
	constructor() {
		super()

		this.state = {}

		autoBind(this,
			'addCaption',
			'removeCaption',
			'getImageMeta',
			'showGalleryModal',
			'onChangeCaption',
			'onTitleChange'
		)
	}

	componentWillReceiveProps (nextProps) {
		// when image url is added/updated
		if(nextProps.imageURL !== this.props.imageURL && this.props.imageIndex === this.props.index) {
			this.getImageMeta(nextProps.imageURL, (height, width) => {
				let newContent = Object.assign({}, this.props.content)
				newContent.width = width
				newContent.height = height
				newContent.imageURL = nextProps.imageURL
				if(!newContent.caption) {
					newContent.caption = ''
				}
				this.props.updateContentValue(newContent, this.props.index)
			})
		}
		// for image caption updates
		else if(nextProps.content && this.props.content) {
			let currentProps = Object.assign({}, this.props.content)
			currentProps.caption = nextProps.content.caption
		}
	}

	addCaption() {
		if(!this.props.content.imageURL) {
			window.alert('Please add an image first')
		}
		else {
			let newContent = Object.assign({}, this.props.content, {caption: '', imageURL: this.props.content.imageURL})
			this.props.updateContentValue(newContent, this.props.index)
		}
	}

	removeCaption() {
		let newContent = Object.assign({}, this.props.content)
		newContent.caption = null
		this.props.updateContentValue(newContent, this.props.index)
	}

	onChangeCaption(e) {
		const caption = e.target.value
		let newContent = Object.assign({}, this.props.content, { caption })
		this.props.updateContentValue(newContent, this.props.index)
	}

	showGalleryModal(e) {
		e.preventDefault()
		this.props.setImageIndex(this.props.index)

		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageGalleryModalVisible'
		})
		window.dispatchEvent(isImageGalleryModalVisible)
	}
	
	getImageMeta(imageURL, cb) {
		let img = new Image()
		img.addEventListener('load', function() {
			cb(this.height, this.width)
		})
		img.src = imageURL
	}
	
	onTitleChange(e) {
		const componentTitle = e.target.value
		this.props.updateComponentTitle(componentTitle, this.props.index)
	}

	render() {
		const showCaption = this.props.content.imageURL && this.props.content.caption !== null ?
		<div className="singleImage__caption">
			<label htmlFor="">Image Caption:</label>
			<input type="text" value={this.props.content.caption} onChange={this.onChangeCaption} className="input"/>
		</div> : null

		const showMeta = this.props.content.width && this.props.content.height ? 
		<div className="singleImage__meta">
			<p>Width: {this.props.content.width}</p>
			<p>Height: {this.props.content.height}</p>
		</div> : null
		
		const showAddButton = this.props.content.caption === null ? 
		<button className="button" onClick={this.addCaption}>Add Caption</button> : null
		const showRemoveButton = this.props.content.caption ? 
		<button className="button" onClick={this.removeCaption}>Remove Caption</button> : null


		return(
			<div className="singleImage box">
				<div className="singleImage__title">
					<h1 className="title">Single Image</h1>
				</div>
				<select name="componentTitle" className="select" value={this.props.componentTitle} onChange={this.onTitleChange}>
					{this.props.componentTitles.map((title, i) => {
						return <option key={i} value={title.title}>{title.title}</option>
					})}
				</select>
				<button className="button" onClick={this.showGalleryModal}>Choose Image</button>
				{showAddButton}
				{showRemoveButton}
				<img src={this.props.content.imageURL} className="image singleImage__image" alt=""/>
				{showMeta}
				{showCaption}
			</div>
		)
	}
}

SingleImage.defaultProps = {
	content: {caption: '', imageURL: ''}
}

SingleImage.propTypes = {
	content: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	componentTitles: PropTypes.array,
	componentTitle: PropTypes.string,
	updateContentValue: PropTypes.func,
	updateComponentTitle: PropTypes.func,
	setImageIndex: PropTypes.func,
	index: PropTypes.number,
	imageIndex: PropTypes.number,
	imageURL: PropTypes.string
}

export default SingleImage