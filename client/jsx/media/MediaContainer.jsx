import React from 'react'
import NavBar from '../NavBar.jsx'
// import S3 from '../../lib/aws.js'

export default class MediaContainer extends React.Component {
	constructor() {
		super()
	}

	getImagesFromS3() {
		
	}

	render() {
		return (
			<div className="media-container">
				<NavBar />
				<h1>Media</h1>
				<div>Images will go here</div>
			</div>
		)
	}
}