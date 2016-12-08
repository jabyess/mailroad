import React from 'react';

class EditorType extends React.Component {
	render() {
		return (
			<option>{this.props.component}</option>
		)
	}
}

export default EditorType;