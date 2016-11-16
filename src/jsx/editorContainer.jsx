import React from 'react'
import MainTextEditor from './MainTextEditor.jsx'
import textEditorDefinitions from './textEditorDefinitions.js'
import editorDefinitions from './editorDefinitions.js'

class EditorContainer extends React.Component {
	constructor() {
		super();

		this.getCurrentValueFromChild = this.getCurrentValueFromChild.bind(this);
		this.triggerCurrentValue = this.triggerCurrentValue.bind(this);
		this.pushTempState = this.pushTempState.bind(this);
		this.createEmail = this.createEmail.bind(this);
		this.getEmailContents = this.getEmailContents.bind(this)
		this.updateActiveEditors = this.updateActiveEditors.bind(this)
		this.tempState = [];
		this.inProgress = false;
		this.state = {
			compiledHTML: [],
			emailContents: {},
			activeEditors: []
		}
	}

	addEditorToContainer(event) {
		this.setState((event) => {
			return this.state.activeEditors.push({toolbarConfig: textEditorDefinitions[event.detail]}) 
		});
	}

	handleEditorChange(value) {
		console.log(value.toString('html'))
	}

	getEmailContents(id) {
		fetch(`/api/getEmail/${id}`)
			.then((response) => {
				return response.json()
			})
			.then((json) => {
				console.log(json)
				this.setState({emailContents: json}, this.updateActiveEditors)
			})
			.catch((ex) => {
				console.log('exception', ex)
			})
	}

	updateActiveEditors() {
		this.state.emailContents.emailContent.forEach((content, i) => {
			this.setState(()=>{
				this.state.activeEditors.push({
					initialValue: content
				})
			})
			
		})
	}

	pushTempState(value, index) {
		this.tempState.splice(index, 1, value.toString('html'));
		if(index === this.state.activeEditors.length - 1 && this.inProgress === true) {
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
		this.state.activeEditors.map((cv, i) => {
			const editorIndex = 'editor' + i;
			this[editorIndex].getCurrentValue();
		});
	}

	componentDidMount() {
		console.log('---editorContainer mounted---')
		window.addEventListener('addNewEditorToEditorContainer', (e) => this.addEditorToContainer(e) );
		window.addEventListener('saveHTMLButtonClicked', () => this.triggerCurrentValue() )

		if(this.props.params.id) {
			console.log(this.props.params)
			this.getEmailContents(this.props.params.id)
		}
		if(!this.props.params.id) {
			this.setState(() => this.state.activeEditors.push({toolbarConfig: textEditorDefinitions.minimalEditor}) );
		}
	}

	render() {
		return (
			<div>
				{this.state.activeEditors.map((prop, i) => {
					var editorRef = 'editor' + i
					return (
						<MainTextEditor 
							key={i}
							toolbarConfig={prop.toolbarConfig}
							index={i}
							initialValue={prop.initialValue}
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