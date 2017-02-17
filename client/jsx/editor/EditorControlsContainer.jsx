import React from 'react'

class EditorControlsContainer extends React.Component {
	constructor() {
		super()

		this.handleEditClick = this.handleEditClick.bind(this)

	}

	handleEditClick() {
		console.log('clicked')
		let toggleEditMode = new CustomEvent('toggleVisible', {
			detail: 'isEditModeActive'
		})
		window.dispatchEvent(toggleEditMode)
	}

	render() {
		return (
			<div className="control is-grouped">
				<div className="control">
					<button className="button is-medium is-warning" onClick={this.handleEditClick}>Edit Mode</button>
				</div>
				<div className="control">
					<button className="button is-medium is-primary" onClick={this.props.saveToDB}>Save</button>
				</div>
				<div className="control">
					<button className="button is-medium is-primary" onClick={this.props.compileHTMLTemplate}>Compile</button>
				</div>
			</div>
		)
	}
}

EditorControlsContainer.propTypes = {
	saveToDB: React.PropTypes.func,
	compileHTMLTemplate: React.PropTypes.func
}

export default EditorControlsContainer