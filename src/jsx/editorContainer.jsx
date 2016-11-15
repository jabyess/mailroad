import React from 'react';
import MainTextEditor from './MainTextEditor.jsx';

class EditorContainer extends React.Component {
	constructor(props) {
		super(props);

		this.getCurrentValueFromChild = this.getCurrentValueFromChild.bind(this);
		this.triggerCurrentValue = this.triggerCurrentValue.bind(this);
		this.pushTempState = this.pushTempState.bind(this);
		this.createEmail = this.createEmail.bind(this);

		this.tempState = [];
		this.inProgress = false;
		this.state = {
			compiledHTML: []
		}
	}

	handleEditorChange(value) {
		console.log(value.toString('html'))
	}

	pushTempState(value, index) {
		this.tempState.splice(index, 1, value.toString('html'));
		if(index === this.props.activeEditors.length - 1 && this.inProgress === true) {
			this.inProgress = false;
			this.setState({compiledHTML: this.tempState}, this.createEmail);
		}
	}

	createEmail() {
		console.log(this.state.compiledHTML);
		fetch('api/createEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"content": this.state.compiledHTML,
				"title": "test post",
			})
		})
	}

	getCurrentValueFromChild(value, index) {
		if(this.inProgress === false) {
			this.inProgress = true;
		}
		this.pushTempState(value, index);
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