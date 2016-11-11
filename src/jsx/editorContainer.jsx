import React from 'react';
import MainTextEditor from './textEditor.jsx';

class EditorContainer extends React.Component {
	constructor(props) {
		super(props);

		this.getCurrentValueFromChild = this.getCurrentValueFromChild.bind(this);
		this.triggerCurrentValue = this.triggerCurrentValue.bind(this);
		this.pushTempState = this.pushTempState.bind(this);
		this.clearTempState = this.clearTempState.bind(this);

		this.tempState = [];
		this.state = {
			compiledHTML: []
		}
	}

	handleEditorChange(value) {
		console.log(value.toString('html'))
	}

	pushTempState(value) {
		if(this.tempState.length >= this.props.activeEditors.length) {
			console.log('tempStateLength', this.tempState.length)
			console.log('ae length', this.props.activeEditors.length)
			this.clearTempState()
		}
		this.tempState.push(value.toString('html'))
	}

	clearTempState() {
		console.log('state before', this.tempState);
		this.tempState.splice(0, this.props.activeEditors.length - 1);
		console.log('state after', this.tempState);
		this.setState({compiledHTML: this.tempState});
	}

	getCurrentValueFromChild(value) {
		this.pushTempState(value);
		// this.setState( (prevState, props) => {
		// 	console.log(prevState);
		// 	return this.state.compiledHTML.push(value.toString('html'))
		// }, () => { console.log('state updated', this.state.compiledHTML) }
		// );
	}

	triggerCurrentValue() {
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
						index={i}
						ref={(value) => {this[editorRef] = value}}
						getCurrentValueFromChild={this.getCurrentValueFromChild}
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