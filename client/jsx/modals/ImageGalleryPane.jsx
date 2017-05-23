import React from 'react'
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
		const { activeImage, loadMoreVisible } = this.props

		const showCopyButtons = activeImage > -1 && !this.props.setImageURL && (
			<div className="imageGalleryModal__pane__block">
				<p>Sizes</p>
				<p>Click to Copy URL</p>
				{this.props.currentImage.sizes.map(s => {
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

		const showInsertButtons = activeImage > -1 && this.props.setImageURL && (
			<div className="imageGalleryModal__pane__block">
				<p>Sizes</p>
				<p>Click to Insert Image</p>
				{this.props.currentImage.sizes.map(s => {
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
					Filename: {this.props.currentImage.filename}
				</div>
				<div className="imageGalleryModal__pane__block">
					<button 
						onClick={this.props.deleteImage}
						className="button is-danger is-outlined imageGalleryModal__delete"
					>
						Delete Image
					</button>
				</div>
			</div>
		)

		const showLoadMore = loadMoreVisible && (
				<div className="imageGalleryModal__pane__footer">
				<button onClick={this.props.loadMore} className="button is-fullwidth">Load More</button>
			</div>
		)

		return(
			<div className="imageGalleryModal__pane">
				<button className="imageGalleryModal__close delete is-large" onClick={this.props.toggleVisible}></button>
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
	loadMore: React.PropTypes.func,
	deleteImage: React.PropTypes.func,
	currentImage: React.PropTypes.object,
	toggleVisible: React.PropTypes.func,
	loadMoreVisible: React.PropTypes.bool,
	activeImage: React.PropTypes.number,
	setImageURL: React.PropTypes.func
}

export default ImageGalleryPane