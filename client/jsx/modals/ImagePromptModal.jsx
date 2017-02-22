import React from 'react'

export default class ImagePromptModal extends React.Component {
	constructor() {
		super()

		this.handleGalleryClick = this.handleGalleryClick.bind(this)
		this.handleExternalClick = this.handleExternalClick.bind(this)
		this.closeModal = this.closeModal.bind(this)

		this.toggleGalleryModal = new CustomEvent('toggleVisible', {
			detail: 'isGalleryModalVisible'
		})
		this.toggleExternalImageModal = new CustomEvent('toggleVisible', {
			detail: 'isExternalImageModalVisible'
		})
		this.toggleImagePromptModal = new CustomEvent('toggleVisible', {
			detail: 'isImagePromptModalVisible'
		})
	}
	
	handleGalleryClick() {
		window.dispatchEvent(this.toggleGalleryModal)
		window.dispatchEvent(this.toggleImagePromptModal)
	}

	handleExternalClick() {
		window.dispatchEvent(this.toggleExternalImageModal)
		window.dispatchEvent(this.toggleImagePromptModal)
	}

	closeModal() {
		window.dispatchEvent(this.toggleImagePromptModal)
	}

	render() {
		return (
			<div className="modal is-active">
				<div className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">Insert image from:</p>
					</header>
					<section className="modal-card-body">
						<button className="button" onClick={this.handleGalleryClick}>Gallery</button>
						<button className="button" onClick={this.handleExternalClick}>External URL</button>
					</section>
				</div>
				<div className="modal-close" onClick={this.closeModal}></div>
			</div>
		)
	}
}