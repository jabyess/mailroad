
import React from 'react'

export default class LinkModal extends React.Component {
	constructor() {
		super()

		this.state = {
			value: null
		}
	}

	render() {
		return (
			<div className="linkModal">
				<input id="editor-link-modal" name="editor-link-modal" type="text" value={this.state.value}/>
				<label htmlFor="editor-link-modal"></label>
			</div>
		)
	}
}