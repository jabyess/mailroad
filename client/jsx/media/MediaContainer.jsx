import React from 'react'
import NavBar from '../NavBar.jsx'
import ImagesContainer from './ImagesContainer.jsx'
import MediaUploadForm from './MediaUploadForm.jsx'

export default class MediaContainer extends React.Component {

	render() {
		return (
			<div className="media-container">
				<NavBar />
				<h1>Media</h1>
				<div>Images will go here</div>
				<MediaUploadForm />
				<ImagesContainer />
			</div>
		)
	}
}