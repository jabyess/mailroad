import React from 'react'
import PropTypes from 'prop-types'
import ClipboardButton from 'react-clipboard.js'

class ImageGalleryPane extends React.Component {
	constructor() {
		super()

	}

	setParentImageURL(url) {
		if(this.props.setImageURL) {
			this.props.setImageURL(url)
			const hideImageGalleryModal = new CustomEvent('toggleVisible', {
				detail: {
					component: 'ImageGalleryModal',
					visible: false
				}
			})

			window.dispatchEvent(hideImageGalleryModal)
		}


	}

	render() {
		const { 
			activeImage,
			loadMoreVisible,
			setImageURL,
			currentImage,
			deleteImage,
			loadMore,
			toggleVisible
		} = this.props

		const showCopyButtons = activeImage > -1 && !setImageURL && (
			<div className="imageGalleryModal__pane__block">
				<p>Sizes</p>
				<p>Click to Copy URL</p>
				{currentImage.sizes.map(s => {
					return (
						<ClipboardButton 
							className="button is-primary imageGalleryModal__pane__block--button" 
							data-clipboard-text={s.url} 
							key={s.id}
						>
							{s.size}
						</ClipboardButton>
					)
				})}
			</div>
		)

		const showInsertButtons = activeImage > -1 && setImageURL && (
			<div className="imageGalleryModal__pane__block">
				<p>Sizes</p>
				<p>Click to Insert Image</p>
				{currentImage.sizes.map(s => {
					return (
						<button 
							className="button is-primary imageGalleryModal__pane__block--button" 
							key={s.id}
							onClick={this.setParentImageURL.bind(this, s.url)}
						>
							{s.size}
						</button>
					)
				})}
			</div>
		)
		
		const showFileInfo = activeImage > -1 && (
			<div>
				<div className="imageGalleryModal__pane__block">
					Filename: {currentImage.filename}
				</div>
				<div className="imageGalleryModal__pane__block">
					<button 
						onClick={deleteImage}
						className="button is-danger is-outlined imageGalleryModal__delete"
					>
						Delete Image
					</button>
				</div>
			</div>
		)

		const showLoadMore = loadMoreVisible && (
				<div className="imageGalleryModal__pane__footer">
				<button onClick={loadMore} className="button is-fullwidth">Load More</button>
			</div>
		)

		return(
			<div className="imageGalleryModal__pane">
				<button className="imageGalleryModal__close delete is-large" onClick={toggleVisible}></button>
				<div className="imageGalleryModal__pane__heading">
					<p className="title">Image Info</p>
				</div>

				{showCopyButtons}
				{showInsertButtons}
				{showFileInfo}
				{showLoadMore}
			</div>
		)
	}
}

ImageGalleryPane.defaultProps = {
	currentImage: {
		sizes: []
	}
}

ImageGalleryPane.propTypes = {
	loadMore: PropTypes.func,
	deleteImage: PropTypes.func,
	currentImage: PropTypes.object,
	toggleVisible: PropTypes.func,
	loadMoreVisible: PropTypes.bool,
	activeImage: PropTypes.number,
	setImageURL: PropTypes.func
}

export default ImageGalleryPane