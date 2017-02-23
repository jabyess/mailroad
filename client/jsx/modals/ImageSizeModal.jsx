import React from 'react'

class ImageSizeModal extends React.Component {
	constructor() {
		super()

		this.insertImageAtSize = this.insertImageAtSize.bind(this)	
	}

	toggleImageSizeModalVisible() {
		const isImageSizeModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageSizeModalVisible'
		})
		window.dispatchEvent(isImageSizeModalVisible)
	}

	insertImageAtSize(e) {
		const url = e.target.dataset.url
		this.props.setImageURL(url)
		this.toggleImageSizeModalVisible()
	}

	render() {
		return this.props.isImageSizeModalVisible && this.props.imageSizes ? 
		(
			<div className="modal is-active image-size-modal">
				<div className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head">Select an Image Size:</header>
					<section className="modal-card-body">
						<nav className="panel">
							{this.props.imageSizes.map((size) => {
								return (
									<div 
										key={size.size}
										className="image-size-modal__row"
										data-url={size.url}
										onClick={this.insertImageAtSize}>
											{size.size}
									</div>
								)
							})}
						</nav>
				</section>
				</div>
				<button className="modal-close" onClick={this.toggleImageSizeModalVisible}></button>
			</div>
		) 
		: null
	}
}

ImageSizeModal.propTypes = {
	isImageSizeModalVisible: React.PropTypes.bool,
	imageSizes: React.PropTypes.array,
	setImageURL: React.PropTypes.func
}

export default ImageSizeModal