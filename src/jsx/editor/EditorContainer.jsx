import React from 'react'
import autoBind from 'react-autobind'
import AddButton from './AddButton.jsx'
import EditorMetaContainer from './EditorMetaContainer.jsx'
import { SlateEditor, DefaultEditor, DatePicker, DatesPicker } from './editor-types/EditorTypes.js'
import EditorTypeSelect from './editor-types/EditorTypeSelect.jsx'
import EditorTypeRow from './EditorTypeRow.jsx'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import PDB from '../../pouchdb/pouchdb.js'

const dynamicEditorTypeList = {
	DefaultEditor,
	SlateEditor,
	DatePicker,
	DatesPicker
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
			'reorderEditorIndexes',
			'toggleEditorTypeSelect',
			'triggerSaveHTML',
			'deleteLocalCopy',
			'compileTemplate',
			'handleParentTitleChange',
			'handleParentTemplateChange'
		)

		this.pouchDB = new PDB('pdb_emailcontent')

		this.state = {
			template: '',
			templates: [],
			content: [],
			isEditorTypeSelectVisible: false
		}
	}

	addEditorToContainer(editorName) {
		editorName.forEach((currentEditor) => {
			this.setState({
				content: this.state.content.concat({
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
		this.pouchDB.getDoc(id, (doc) => {
			if(doc && doc.name === "not_found") {
				console.log('---doc not found---')
				fetch(`/api/getEmail/${id}`)
					.then((response) => {
						return response.json()
					})
					.then((json) => {
						let jsonResponse = {}
						Object.assign(jsonResponse, json)
						this.setState(() => {
							return jsonResponse
						})
						this.pouchDB.createOrUpdateDoc(jsonResponse)
					})
					.catch((err) => {
						console.log('exception in getEmailContents: ', err)
					})
			}
			else {
				console.log('---doc found----')
				console.log(doc)
				this.setState(doc, () => {
					this.pouchDB.createOrUpdateDoc(doc)
				})
			}


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
		let content = [{content: '<p>Just start typing</p>', editorType: 'DefaultEditor'}]
		let title = 'New Email'
		fetch('/api/createNewEmail', {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify({
				content: content,
				title: title
			})
		})
		.then((results) => {
			return results.json()
		}).then((json) => {
			this.setState({
				emailID: json.id,
				title: json.title,
				createdAt: json.createdAt,
				updatedAt: json.updatedAt,
				content: json.content
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
				"id" : this.state.id,
				"template": this.state.template
			})
		})
	}

	handleParentTitleChange(value) { 
		this.setState({title: value})
	}

	handleParentTemplateChange(value) {
		this.setState({template : value})
	}

	deleteLocalCopy() {
		console.log('deleteLocalCopy fired')
		this.pouchDB.deleteDoc('pdb_'+this.state.id)
	}

	compileTemplate() {
		fetch('/api/compileTemplate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
				{ content, title, template } = this.state
				// content : this.state.content,
				// title : this.state.title,
				// template : this.state.template
			)
		})
		.then((response) => {
			return response.text()
		})
		.then((text) => {
			console.log(text)
		})
	}

	triggerSaveHTML() {
		console.log('triggerSaveHTML clicked')
		this.pouchDB.getDoc(this.state.id, (doc) => {
			console.log(doc)
			this.setState(doc, () => {
				fetch('/api/updateEmail', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(doc)
				}).then((json) => {
					console.log(json)
				})
			})
			
		})
	}

	componentDidMount() {
		window.addEventListener('saveHTMLButtonClicked', this.triggerSaveHTML )
		window.addEventListener('deleteLocalCopy', this.deleteLocalCopy )

		this.getTemplates()

		//if we have an ID from react-router, make db call to get data
		if(this.props.params.id) {
			this.getEmailContents(this.props.params.id)
		}

		//if we have no ID from react-router, create new email instance
		if(!this.props.params.id) {
			this.createEmail();
		}
	}

	toggleEditorTypeSelect(value) {
		this.setState({isEditorTypeSelectVisible: value})
	}

	reorderEditorIndexes(oldIndex, newIndex) {
		this.setState(() => {
			let removed = this.state.content.splice(oldIndex, 1)
			this.state.content.splice(newIndex, 0, removed[0])
			return this.state.content
		})
	}
	
	componentWillUnmount () {
		window.removeEventListener('saveHTMLButtonClicked', this.triggerSaveHTML)
		window.removeEventListener('deleteLocalCopy', this.deleteLocalCopy)
	}

	render() {
		return (
			<div className="editor-container">
				<EditorMetaContainer
					id={this.state.id}
					createdAt={this.state.createdAt}
					updatedAt={this.state.updatedAt}
					handleParentTitleChange={this.handleParentTitleChange}
					handleParentTemplateChange={this.handleParentTemplateChange}
					title={this.state.title}
					templates={this.state.templates}
					template={this.state.template}
				/>
				<AddButton toggleEditorTypeSelect={this.toggleEditorTypeSelect} />
				<div className="editor-editor-container">
					{this.state.content.map((content, i) => {
						let DynamicEditorType = dynamicEditorTypeList[content.editorType];
						return (
							<EditorTypeRow key={i} index={i} reorderEditorIndexes={this.reorderEditorIndexes}>
								<DynamicEditorType
									content={content.content}
									key={i}
									index={i}
									id={this.state.id}
									editorType={content.editorType}
								/>
							</EditorTypeRow>
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

export default DragDropContext(HTML5Backend)(EditorContainer);