import React from 'react'
import classNames from 'classnames'

class EditorControlsContainer extends React.Component {
	constructor() {
		super()

		this.handleEditClick = this.handleEditClick.bind(this)

	}

	handleEditClick() {
		let toggleEditMode = new CustomEvent('toggleVisible', {
			detail: 'isEditModeActive'
		})
		window.dispatchEvent(toggleEditMode)
	}

	render() {
		const editButtonClasses = classNames({
			button: true,
			'is-medium': true,
			'is-warning': true,
			'is-active': this.props.isEditModeActive
		})

		return (
			<div className="editorControlsContainer">
				<div className="control is-grouped">
					<div className="control">
						<button className={editButtonClasses} onClick={this.handleEditClick}>Edit Mode</button>
					</div>
					<div className="control">
						<button className="button is-medium is-primary" onClick={this.props.saveToDB}>Save</button>
					</div>
					<div className="control">
						<button className="button is-medium is-primary" onClick={this.props.compileHTMLTemplate}>Compile</button>
					</div>
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