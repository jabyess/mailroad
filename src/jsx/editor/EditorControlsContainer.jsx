import React from 'react'

export default class EditorControlsContainer extends React.Component {
	constructor() {
		super()

		this.handleEditClick = this.handleEditClick.bind(this)

	}

	handleEditClick() {
		console.log('handleReorderClick clicked')
		if(this.props.toggleEditMode) {
			this.props.toggleEditMode()
		}
	}

	render() {
		return (
			<div className="editor-controls">
				<button className="editor-controls--button" onClick={this.handleEditClick}>Edit Mode</button>
			</div>
		)
	}
}