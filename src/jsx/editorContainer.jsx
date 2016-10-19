import React from 'react';
import MainTextEditor from './richTextEditor.jsx';

class EditorContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	handleEditorChange(value) {
		// console.log(value.toString('html'))	
  }

	getCurrentValue(value) {
		console.log(value.toString('html'))
	}

	componentDidMount() {
		console.log('---editorContainer---')
		console.log(this);
	}

	handleEditorSubmit(e) {
		console.log(e);
	}

	render() {
		return (
			<div className="editorItems">
				<MainTextEditor onChange={this.handleEditorChange} currentValue={this.getCurrentValue} />
			</div>
		)
	}
}

// EditorContainer.propTypes = {
// 	currentValue: React.PropTypes.func
// }

export default EditorContainer;