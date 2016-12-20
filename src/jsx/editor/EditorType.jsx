import React from 'react';

class EditorType extends React.Component {
	constructor() {
		super()
		this.displayName = "EditorType"
	}
	render() {
		return (
			<option>{this.props.component}</option>
		)
	}
}

export default EditorType;