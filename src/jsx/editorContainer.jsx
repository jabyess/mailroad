import React from 'react';
import MainTextEditor from './textEditor.jsx';

class EditorContainer extends React.Component {
	constructor(props) {
		super(props);

		this.getCurrentValue = this.getCurrentValue.bind(this);

		this.state = {
			compiledHTML: []
		}
	}

	handleEditorChange(value) {
		// console.log(value.toString('html'))	
	}

	getCurrentValue(value) {
		console.log(value.toString('html'))
		let tmp = value.toString('html')
		this.setState(()=> { return this.state.compiledHTML.push(tmp) })

		if(this.props.compiledValue) {
			this.props.compiledValue(this.state.compiledHTML);
		}
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
						<MainTextEditor key={i} onChange={this.handleEditorChange} currentValue={this.getCurrentValue} toolbarConfig={cv} />
					)
				})}
			</div>
		)
	}
}

EditorContainer.propTypes = {
	activeEditors: React.PropTypes.array,
	compiledValue: React.PropTypes.func
}

export default EditorContainer;