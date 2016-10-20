import React from 'react';
import MainTextEditor from './textEditor.jsx';

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
				{this.props.activeEditors.map((cv, i) => {
					return (
						<MainTextEditor key={i} onChange={this.handleEditorChange} currentValue={this.getCurrentValue} toolbarConfig={cv}/>
					)
				})}
			</div>
		)
	}
}

EditorContainer.propTypes = {
	activeEditors: React.PropTypes.array
}

export default EditorContainer;