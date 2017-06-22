import React from 'react'
import autoBind from 'react-autobind'
import MediaUploadForm from './MediaUploadForm'
import ImageGalleryModal from '../modals/ImageGalleryModal'


class MediaContainer extends React.Component {

	constructor() {
		super()

		this.state = { 
			visible: {}
		}

		autoBind(this,
			'toggleVisible'
		)
	}

	toggleVisible(event) {
		const { component, visible } = event.detail
		this.setState((state) => {
			return state.visible[component] = visible
		})
	}

	componentDidMount () {
		window.addEventListener('toggleVisible', this.toggleVisible)
	}
	
	componentWillUnmount () {
		window.removeEventListener('toggleVisible', this.toggleVisible)
	}
	

	render() {
		const renderImageGalleryModal = this.state.visible.ImageGalleryModal ? <ImageGalleryModal /> : null
		return (
			<div className="media-container">
				{renderImageGalleryModal}
				<MediaUploadForm />
			</div>
		)
	}
}

export default MediaContainer