import React from 'react'

export default class ImagePromptModal extends React.Component {
	constructor() {
		super()

		this.handleGalleryClick = this.handleGalleryClick.bind(this)
		this.handleExternalClick = this.handleExternalClick.bind(this)
	}
	
	handleGalleryClick() {
		let toggleGalleryModal = new CustomEvent('toggleGalleryModal')
		window.dispatchEvent(toggleGalleryModal)
	}

	handleExternalClick() {
		let toggleExternalImageModal = new CustomEvent('toggleExternalImageModal')
		window.dispatchEvent(toggleExternalImageModal)
	}

	render() {
		return (
			<div className="imagePromptModal">
				<div className="imagePromptModal--content">
					<h1 className="imagePromptModal--title">Insert Image from: </h1>
					<button className="imagePromptModal--button" onClick={this.handleGalleryClick}>Gallery</button>
					<button className="imagePromptModal--button" onClick={this.handleExternalClick}>External URL</button>
				</div>
			</div>
		)
	}
}