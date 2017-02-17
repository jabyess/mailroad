import React from 'react'
import ImageGalleryModal from '../modals/ImageGalleryModal.jsx'
import MediaUploadForm from './MediaUploadForm.jsx'


class MediaContainer extends React.Component {

	constructor() {
		super()

		this.state = {
			displayImageGalleryModal: false
		}

		this.toggleImageGalleryModal = this.toggleImageGalleryModal.bind(this)
	}

	toggleImageGalleryModal() {
		this.setState({displayImageGalleryModal: !this.state.displayImageGalleryModal})
	}

	render() {
		return (
			<div className="media-container">
				<div className="columns">
					<div className="column is-10 is-offset-1">
						<MediaUploadForm 
							toggleImageGalleryModal={this.toggleImageGalleryModal}
						/>
						<ImageGalleryModal
							toggleImageGalleryModal={this.toggleImageGalleryModal}
							displayImageGalleryModal={this.state.displayImageGalleryModal}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default MediaContainer