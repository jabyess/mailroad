import React from 'react'
import MainTextEditor from './MainTextEditor.jsx'
import textEditorDefinitions from './textEditorDefinitions.js'
import autoBind from 'react-autobind'
import AddButton from './AddButton.jsx'
import EditorMetaContainer from './EditorMetaContainer.jsx'

class EditorContainer extends React.Component {
	constructor() {
		super();

		autoBind(this, 
			'getCurrentValueFromChild',
			'triggerSaveHTML',
			'pushTempState',
			'createEmail',
			'getEmailContents',
			'updateActiveEditors',
			'getEditorType',
			'compileTemplate',
			'handleParentTitleChange',
			'handleParentTemplateChange'
		)

		this.tempState = []
		this.inProgress = false
		this.state = {
			compiledHTML: [],
			emailContents: {},
			activeEditors: [],
			selectedTemplate: '',
			templates: []
		}
	}

	addEditorToContainer(event) {
		let eventDetail = event.detail
		this.setState((event) => {
			return this.state.activeEditors.push({
				toolbarConfig: textEditorDefinitions[eventDetail],
				editorType: this.getEditorType(textEditorDefinitions, eventDetail)
			})
		});
	}

	getEditorType(editorList, eventDetail) {
		let newVal = Object.keys(editorList).filter((val) => {
			return val === eventDetail
		})
		return newVal[0]
	}

	getEmailContents(id) {
		fetch(`/api/getEmail/${id}`)
			.then((response) => {
				return response.json()
			})
			.then((json) => {
				this.setState({
					emailContents: json,
					title: json.title,
					id: json.id,
					updatedAt: json.updatedAt,
					createdAt: json.createdAt,
					selectedTemplate: json.template
				}, this.updateActiveEditors)
			})
			.catch((ex) => {
				console.log('exception', ex)
			})
	}

	updateActiveEditors() {
		this.state.emailContents.emailContent.forEach((content, i) => {
			this.setState(()=>{
				this.state.activeEditors.push({
					initialValue: content.content,
					editorType: content.editorType
				})
			})
		})
	}

	pushTempState(valueObj, index) {
		this.tempState.splice(index, 1, 
		{
			content: valueObj.value.toString('html'),
			editorType: valueObj.editorType
		});
		if(index === this.state.activeEditors.length - 1 && this.inProgress === true) {
			this.inProgress = false;
			this.setState({compiledHTML: this.tempState}, this.updateEmail);
		}
	}

	getTemplates() {
		fetch('/api/templates')
			.then((response) => {
				return response.json()
			})
			.then((json) => {
				this.setState({ templates: json })
			})
			.catch((err) => {
				console.log('there was an error: ', err)
			})

	}

	createEmail() {
		fetch('/api/createNewEmail', {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json'
			},
			body: {}
		})
		.then((results) => {
			return results.json()
		}).then((json) => {
			this.setState({
				id: json.id,
				title: 'New Email',
				createdAt: json.createdAt,
				updatedAt: json.updatedAt
			})
		})
	}

	updateEmail() {
		fetch('/api/updateEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"content": this.state.compiledHTML,
				"title": this.state.title,
				"id" : this.state.id,
				"template": this.state.selectedTemplate
			})
		})
	}

	handleParentTitleChange(value) {
		this.setState({title: value})
	}

	handleParentTemplateChange(value) {
		this.setState({selectedTemplate : value})
	}

	getCurrentValueFromChild(valueObj, index) {
		if(this.inProgress === false) {
			this.inProgress = true;
		}
		this.pushTempState(valueObj, index)
	}

	triggerSaveHTML() {
		this.state.activeEditors.map((cv, i) => {
			const editorIndex = 'editor' + i
			this[editorIndex].getCurrentValue()
		});
	}

	compileTemplate() {
		console.log('fired compileTemplate')
		fetch('/api/compileTemplate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				emailContent : this.state.emailContents.emailContent,
				title : this.state.title,
				template : this.state.selectedTemplate
			})
		})
		.then((response) => {
			return response.text()
		})
		.then((text) => {
			console.log(text)
		})
	}

	componentDidMount() {
		this.addEditorTempFunction = (e) => {
			this.addEditorToContainer(e)
		}
		window.addEventListener('addNewEditorToEditorContainer', this.addEditorTempFunction )
		window.addEventListener('saveHTMLButtonClicked', this.triggerSaveHTML )
		window.addEventListener('compileTemplateFromSource', this.compileTemplate )

		this.getTemplates()

		//if we have an ID from react-router, make db call to get data
		if(this.props.params.id) {
			this.getEmailContents(this.props.params.id)
		}

		//if we have no ID from react-router, create new email instance
		if(!this.props.params.id) {
			this.createEmail();
			this.setState(() => { 
				this.state.activeEditors.push({
					toolbarConfig: textEditorDefinitions.defaultEditor,
					editorType: 'defaultEditor'
				})
			});
		}
	}

	componentWillUnmount () {
		window.removeEventListener('addNewEditorToEditorContainer', this.addEditorTempFunction)
		window.removeEventListener('saveHTMLButtonClicked', this.triggerSaveHTML)
		window.removeEventListener('compileTemplateFromSource', this.compileTemplate)
	}

	render() {
		return (
			<div className="editor-container">
				<EditorMetaContainer
					emailID={this.state.id}
					createdAt={this.state.createdAt}
					updatedAt={this.state.updatedAt}
					handleParentTitleChange={this.handleParentTitleChange}
					handleParentTemplateChange={this.handleParentTemplateChange}
					title={this.state.title}
					templates={this.state.templates}
					selectedTemplate={this.state.selectedTemplate}
				/>
				<AddButton />
				{this.state.activeEditors.map((prop, i) => {
					var editorRef = 'editor' + i
					return (
						<MainTextEditor 
							key={i}
							toolbarConfig={prop.toolbarConfig}
							index={i}
							editorType={prop.editorType}
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