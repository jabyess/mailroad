import React from 'react'
import autoBind from 'react-autobind'
import AddButton from './AddButton.jsx'
import EditorMetaContainer from './EditorMetaContainer.jsx'
import { SlateEditor, DefaultEditor, DatePicker } from './editor-types/EditorTypes.js'
import EditorTypeSelect from './editor-types/EditorTypeSelect.jsx'

const dynamicEditorTypeList = {
	DefaultEditor,
	SlateEditor,
	DatePicker
}

class EditorContainer extends React.Component {
	constructor() {
		super();

		autoBind(this, 
			'createEmail',
			'updateEmail',
			'getEmailContents',
			'addEditorToContainer',
			'getEditorType',
			'toggleEditorTypeSelect',
			'compileTemplate',
			'handleParentTitleChange',
			'handleParentTemplateChange'
		)

		this.state = {
			selectedTemplate: '',
			templates: [],
			emailContent: [],
			isEditorTypeSelectVisible: false
		}
	}

	addEditorToContainer(editorName) {
		editorName.forEach((currentEditor) => {
			this.setState({
				emailContent: this.state.emailContent.concat({
					content: '<p>New Editor</p>',
					editorType: currentEditor
				})
			})
		})
		
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
					emailContent: json.emailContent,
					title: json.title,
					updatedAt: json.updatedAt,
					createdAt: json.createdAt,
					emailID: json.id,
					selectedTemplate: json.template
				})
			})
			.catch((err) => {
				console.log('exception in getEmailContents: ', err)
			})
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
		let emailContent = [{content: '<p>Just start typing</p>', editorType: 'DefaultEditor'}]
		let emailTitle = 'New Email'
		fetch('/api/createNewEmail', {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				emailContent: emailContent,
				emailTitle: emailTitle
			})
		})
		.then((results) => {
			return results.json()
		}).then((json) => {
			this.setState({
				emailID: json.id,
				title: json.emailTitle,
				createdAt: json.createdAt,
				updatedAt: json.updatedAt,
				emailContent: json.emailContent
			})
		})
		.catch((err) => {
			console.log("error in createEmail: ", err)
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
				"emailID" : this.state.id,
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

	compileTemplate() {
		fetch('/api/compileTemplate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				emailContent : this.state.emailContent,
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
		if(this.props.params.emailID) {
			this.getEmailContents(this.props.params.emailID)
		}

		//if we have no ID from react-router, create new email instance
		if(!this.props.params.emailID) {
			this.createEmail();
		}
	}

	toggleEditorTypeSelect(value) {
		this.setState({isEditorTypeSelectVisible: value})
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
					emailID={this.state.emailID}
					createdAt={this.state.createdAt}
					updatedAt={this.state.updatedAt}
					handleParentTitleChange={this.handleParentTitleChange}
					handleParentTemplateChange={this.handleParentTemplateChange}
					title={this.state.title}
					templates={this.state.templates}
					selectedTemplate={this.state.selectedTemplate}
				/>
				<AddButton toggleEditorTypeSelect={this.toggleEditorTypeSelect} />
				<div className="editor-editor-container">
					{this.state.emailContent.map((content, i) => {
						let DynamicEditorType = dynamicEditorTypeList[content.editorType];
						return (
							<DynamicEditorType
								content={content.content}
								key={i}
							/>
						)
					})}
				</div>
				<div className="editor-type-list">
					<EditorTypeSelect
						addEditorToContainer={this.addEditorToContainer}
						toggleEditorTypeSelect={this.toggleEditorTypeSelect} 
						isEditorTypeSelectVisible={this.state.isEditorTypeSelectVisible}
					/>
				</div>
			</div>
		)	
	}
}

export default EditorContainer;