import React from 'react';
import MainTextEditor from './textEditor.jsx';

class EditorContainer extends React.Component {
	constructor(props) {
		super(props);

		this.getCurrentValue = this.getCurrentValue.bind(this);
		this.triggerCurrentValue = this.triggerCurrentValue.bind(this);

		this.state = {
			compiledHTML: []
		}
	}

	handleEditorChange(value) {
		console.log(value.toString('html'))	
	}

	getCurrentValueFromChild(value) {
		console.log(value.toString('html'))
		this.setState( () => { return this.state.compiledHTML.push(value.toString('html')) })
		console.log(this.state);
	}

	triggerCurrentValue() {
		// this.getCurrentValue();
		this.props.activeEditors.map((cv, i) => {
			const editorIndex = 'editor' + i;
			this[editorIndex].getCurrentValue();
		});

	}

	componentDidMount() {
		console.log('---editorContainer mounted---')
		window.addEventListener('saveHTMLButtonClicked', () => {
			this.triggerCurrentValue();
			
		})
	}

	render() {
		return (
			<div>
				{this.props.activeEditors.map((prop, i) => {
					var editorRef = 'editor' + i;
					return (
						<MainTextEditor 
						key={i}
						toolbarConfig={prop}
						ref={(value) => this[editorRef] = value}
						getCurrentValueFromChild={this.getCurrentValue}
						/>
					)
				})}	
			</div>
		)
	}
}

EditorContainer.propTypes = {
	activeEditors: React.PropTypes.array,
	compiledValue: React.PropTypes.func,
}

export default EditorContainer;