import React from 'react'
import NavBar from '../NavBar.jsx'
import ImageGalleryModal from '../modals/ImageGalleryModal.jsx'
import MediaUploadForm from './MediaUploadForm.jsx'

export default class MediaContainer extends React.Component {

	render() {
		return (
			<div className="media-container">
				<NavBar />
				<h1>Media</h1>
				<MediaUploadForm />
				<ImageGalleryModal />
			</div>
		)
	}
}