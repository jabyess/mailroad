import React from 'react'
import autoBind from 'react-autobind'
import MediaUploadForm from './MediaUploadForm.jsx'
import ImageGalleryModal from '../modals/ImageGalleryModal.jsx'


class MediaContainer extends React.Component {

	constructor() {
		super()

		this.state = {

		}

		autoBind(this,
			'toggleImageGalleryModal',
			'toggleVisible'
		)
	}

	toggleImageGalleryModal() {
		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageGalleryModalVisible'
		})
		window.dispatchEvent(isImageGalleryModalVisible)
	}

	toggleVisible(event) {
		let visibleKey = event.detail.toString()
		console.log(visibleKey)
		this.setState(() => {
			let visibleObj = {}
			visibleObj[visibleKey] = !this.state[visibleKey]
			return visibleObj
		})
	}

	componentDidMount () {
		window.addEventListener('toggleVisible', this.toggleVisible)
	}
	
	componentWillUnmount () {
		window.removeEventListener('toggleVisible', this.toggleVisible)
	}
	

	render() {
		const renderImageGalleryModal = this.state.isImageGalleryModalVisible ? <ImageGalleryModal /> : null
		return (
			<div className="media-container">
				<div className="columns">
					<div className="column">
						{renderImageGalleryModal}
						<MediaUploadForm />
					</div>
				</div>
			</div>
		)
	}
}

export default MediaContainer