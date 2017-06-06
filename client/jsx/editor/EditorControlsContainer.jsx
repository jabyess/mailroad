import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class EditorControlsContainer extends React.Component {
	constructor() {
		super()

		this.handleEditClick = this.handleEditClick.bind(this)

	}

	handleEditClick() {
		let toggleEditMode = new CustomEvent('toggleVisible', {
			detail: {
				component: 'isEditModeActive',
				visible: !this.props.isEditModeActive
			}
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
		)
	}
}

EditorControlsContainer.propTypes = {
	saveToDB: PropTypes.func,
	compileHTMLTemplate: PropTypes.func,
	isEditModeActive: PropTypes.bool
}

export default EditorControlsContainer