import React from 'react'
import ClipboardButton from 'react-clipboard.js'

class SourceModal extends React.Component {
	constructor() {
		super()

	}

	toggleVisible() {
		const	isSourceModalVisible = new CustomEvent('toggleVisible', {
			detail: {
				component: 'SourceModal',
				visible: false
			}
		})

		window.dispatchEvent(isSourceModalVisible)
	}

	render() {
		return(
			<div className="sourceModal is-active modal">
				<div className="modal-background"></div>
				<div className="modal-content sourceModal__content">
					<div className="control">
						<textarea 
							id="sourceModal__content__textarea"
							className="textarea sourceModal__content__textarea"
							value={this.props.textContent} 
							readOnly
						>
						</textarea>
					</div>
					<ClipboardButton className="button" data-clipboard-text={this.props.textContent}>Copy to Clipboard</ClipboardButton>
				</div>
				<div className="modal-close" onClick={this.toggleVisible}></div>
			</div>

		)
	}
}

SourceModal.propTypes = {
	textContent: React.PropTypes.string

}

export default SourceModal