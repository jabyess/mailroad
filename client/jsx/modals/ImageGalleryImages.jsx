import React from 'react'

class ImageGalleryImages extends React.Component {
	constructor() {
		super()

		this.setActiveImage = this.setActiveImage.bind(this)
	}

	setActiveImage(e) {
		let { grouping, index } = e.currentTarget.dataset
		
		this.props.setActiveImage(index)
		this.props.getImageInfo(grouping)

	}

	render() {
		return(
			<div className="imageGalleryModal__images">
				{this.props.images.map((image, index) => {
					const activeClass = index === this.props.activeImage ? 'imageGalleryModal__image active' : 'imageGalleryModal__image'
					return (
						<div
							key={image.id} 
							className={activeClass}
							data-grouping={image.grouping}
							data-index={index}
							data-id={image.id}
							onClick={this.setActiveImage}
						>
							<img src={image.url} alt="" className="image"/>
						</div>
					)
				})}
			</div>
		)
	}
}

ImageGalleryImages.propTypes = {
	images: React.PropTypes.array,
	getImageInfo: React.PropTypes.func,
	setActiveImage: React.PropTypes.func,
	activeImage: React.PropTypes.number

}

export default ImageGalleryImages