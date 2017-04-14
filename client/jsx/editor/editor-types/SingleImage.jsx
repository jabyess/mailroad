import React from 'react'
import autoBind from 'react-autobind'

class SingleImage extends React.Component {
	constructor() {
		super()

		this.state = {}

		autoBind(this,
			'addCaption',
			'removeCaption',
			'getImageMeta',
			'showGallery',
			'onChangeCaption',
			'onTitleChange'
		)
	}

	componentWillReceiveProps (nextProps) {
		//sets the image url and state from gallery, for new images
		if(nextProps.imageURL !== this.props.imageURL && this.props.imageIndex === this.props.index) {
			this.getImageMeta(nextProps.imageURL)
			this.props.updateContentValue({imageURL: nextProps.imageURL}, this.props.index)
		}
		// these checks make sure adding a caption doesnt blow out the image 
		// by setting null values to top level state
		// and vice versa
		if(nextProps.content.imageURL) {
			this.getImageMeta(nextProps.content.imageURL)
			this.setState({imageURL: nextProps.content.imageURL})
		}
		if(nextProps.content.caption) {
			this.setState({caption: nextProps.content.caption, captionVisible: true})
		}
	}

	addCaption() {
		if(!this.state.imageURL) {
			window.alert('Please add an image first')
		}
		else if(this.state.caption && this.state.caption.length > 0) {
			return false
		}
		else {
			console.log('adding caption')
			this.setState({captionVisible: true})
			this.props.updateContentValue({ caption: 'Enter caption', imageURL: this.state.imageURL }, this.props.index)
		}
	}

	removeCaption() {
		this.props.updateContentValue({caption: null, imageURL: this.state.imageURL}, this.props.index)
		this.setState({captionVisible: false, caption: null})
	}

	onChangeCaption(e) {
		const caption = e.target.value
		this.setState({ caption })
		this.props.updateContentValue({ caption, imageURL: this.state.imageURL}, this.props.index)
	}

	showGallery(e) {
		e.preventDefault()
		this.props.setImageIndex(this.props.index)

		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageGalleryModalVisible'
		})
		window.dispatchEvent(isImageGalleryModalVisible)
	}
	
	getImageMeta(imageURL) {
		const img = new Image()
		let self = this
		img.addEventListener('load', function() {
			self.setState({height: this.height, width: this.width})
		})
		img.src = imageURL
	}
	
	onTitleChange(e) {
		const componentTitle = e.target.value
		this.props.updateComponentTitle(componentTitle, this.props.index)
	}

	render() {
		const showCaption = this.state.captionVisible ? 
		<div className="singleImage__caption">
			<label htmlFor="">Image Caption:</label>
			<input type="text" value={this.props.content.caption} onChange={this.onChangeCaption} className="input"/>
		</div>
		: null
		const showMeta = this.props.content.imageURL ? 
		<div className="singleImage__meta">
			<p>Width: {this.state.width}</p>
			<p>Height: {this.state.height}</p>
		</div> : null
		const showRemoveButton = this.state.captionVisible ? <button className="button" onClick={this.removeCaption}>Remove Caption</button> : null

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
				<button className="button" onClick={this.showGallery}>Choose Image</button>
				<button className="button" onClick={this.addCaption}>Add Caption</button>
				{showRemoveButton}
				<img src={this.props.content.imageURL} className="image singleImage__image" alt=""/>
				{showMeta}
				{showCaption}
			</div>
		)
	}
}

SingleImage.propTypes = {
	content: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
	componentTitles: React.PropTypes.array,
	componentTitle: React.PropTypes.string,
	updateContentValue: React.PropTypes.func,
	updateComponentTitle: React.PropTypes.func,
	setImageIndex: React.PropTypes.func,
	index: React.PropTypes.number,
	imageIndex: React.PropTypes.number,
	imageURL: React.PropTypes.string
}

export default SingleImage