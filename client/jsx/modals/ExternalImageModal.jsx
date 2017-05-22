import React from 'react'

class ExternalImageModal extends React.Component {
	constructor() {
		super()

		this.toggleVisible = this.closeModal.bind(this)
		this.setImageURL = this.setImageURL.bind(this)
		this.setLocalImageURL = this.setLocalImageURL.bind(this)

		this.modalVisible = new CustomEvent('toggleVisible', {
			detail: {
				component: 'ExternalImageModal',
				visible: false
			}
		})
	}

	closeModal() {
		window.dispatchEvent(this.modalVisible)
	}

	setImageURL() {
		let url = this.state.imageURL
		this.props.setImageURL(url)
		window.dispatchEvent(this.modalVisible)
	}

	setLocalImageURL(e) {
		let imageURL = e.target.value
		this.setState({ imageURL })
	}

	render() {
		return this.props.isExternalImageModalVisible ? 
		(
			<div className="externalImageModal modal is-active">
				<div className="modal-background"></div>
				<div className="modal-card">
					<div className="modal-card-head"><p>Enter External Image URL</p></div>
					<div className="modal-card-body">
						<form>
							<label htmlFor="">URL:</label>
							<input type="text" className="input" value={this.props.imageURL} onChange={this.setLocalImageURL}/>
							<button className="button" onClick={this.setImageURL}>Submit</button>
						</form>
					</div>
				</div>
				<button className="modal-close" onClick={this.closeModal}></button>
				
			</div>
		) : null
	}
}

ExternalImageModal.propTypes = {
	isExternalImageModalVisible: React.PropTypes.bool,
	setImageURL: React.PropTypes.func,
	imageURL: React.PropTypes.string
	

}

export default ExternalImageModal