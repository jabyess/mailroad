import React from 'react'
import autoBind from 'react-autobind'
import AddButton from './AddButton.jsx'
import EditorMetaContainer from './EditorMetaContainer.jsx'
import { SlateEditor, DefaultEditor, DatePicker, DatesPicker } from './editor-types/EditorTypes.js'
import EditorTypeSelect from './editor-types/EditorTypeSelect.jsx'
import EditorTypeRow from './EditorTypeRow.jsx'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import EditorControlsContainer from './EditorControlsContainer.jsx'
import PDB from '../../pouchdb/pouchdb.js'
import { debounce } from '../../lib/utils.js'

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
			'deleteLocalCopy',
			'toggleEditMode',
			'handleTitleChange',
			'handleTemplateChange',
			'updateParentStateContent',
			'updateComponentTitle',
			'removeEditorFromContainer',
			'compileTemplate',
		)

		this.pouchDB = new PDB('pdb_emailcontent')

		this.pouchDB.createOrUpdateDoc = debounce(this.pouchDB.createOrUpdateDoc, 1000)

		this.state = {
			template: '',
			templates: [],
			content: [],
			isEditorTypeSelectVisible: false,
			isEditModeActive: false
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

	removeEditorFromContainer(index) {
		this.setState(() => {
			this.state.content.splice(index, 1)
		})
	}

	handleTitleChange(value) {
		this.setState({title: value})
	}
	handleTemplateChange(value) {
		this.setState({template: value})
	}

	updateParentStateContent(content, index) {
		console.log(content, index)
		this.setState(() => {
			this.state.content[index].content = content
		})
	}

	updateComponentTitle(title, index) {
		this.setState(() => {this.state.content[index].componentTitle = title})
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
				fetch(`/api/getEmail/${id}`)
					.then((response) => {
						return response.json()
					})
					.then((json) => {
						let jsonResponse = {}
						Object.assign(jsonResponse, json)
						console.log('jsonResponse', jsonResponse)
						this.setState(jsonResponse)
					})
					.catch((err) => {
						console.log('exception in getEmailContents: ', err)
					})
			}
			else {
				console.log("getEmailContents doc.rev",doc._rev)
				console.log("getEmailContents state.rev",this.state._rev)
				this.setState(doc, () => {
					// this.pouchDB.createOrUpdateDoc(doc)
					console.log('set state from pdb doc')
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
		let content = [{
			content: '<p>Just start typing</p>',
			editorType: 'DefaultEditor',
			componentTitle: "New Component"
		}]
		let title = 'New Email'
		let doc = {content, title}
		fetch('/api/createNewEmail', {
			method: 'POST',
			headers: {
				'Content-Type' : 'application/json'
			},
			body: JSON.stringify(doc)
		})
		.then((results) => {
			return results.json()
		}).then((json) => {
			let jsonResponse = Object.assign({}, json)
			this.setState(() => {
				return jsonResponse
			})
			// this.pouchDB.createOrUpdateDoc(jsonResponse)
		})
		.catch((err) => {
			console.log("error in createEmail: ", err)
		})
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
			)
		})
		.then((response) => {
			return response.text()
		})
		.then((text) => {
			console.log(text)
		})
	}

	updateEmail() {
		let currentState = this.state
		this.pouchDB.getDoc(this.state.id, (doc) => {
			console.log('updateEmail doc.rev', doc._rev)
		})
		fetch('/api/updateEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(currentState)
		}).then((json) => {
			console.log(json)
			console.log('updateEmail state.rev', currentState._rev)

			// success toast popup
		})
	}

	componentDidMount() {
		window.addEventListener('saveHTMLButtonClicked', this.updateEmail )
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

	toggleEditMode() {
		this.pouchDB.getDoc(this.state.id, (doc) => {
			doc.isEditModeActive = !this.state.isEditModeActive
			console.log("editModedoc ", doc);
			this.setState(doc)
		})
	}
	
	componentWillUnmount () {
		window.removeEventListener('saveHTMLButtonClicked', this.updateEmail)
		window.removeEventListener('deleteLocalCopy', this.deleteLocalCopy)
	}

	componentDidUpdate(prevProps, prevState) {
		this.pouchDB.createOrUpdateDoc(this.state)
	}

	render() {
		return (
			<div className="editor-container">
				<EditorMetaContainer {...this.state} 
					handleTitleChange={this.handleTitleChange}
					handleTemplateChange={this.handleTemplateChange}
				/>
				<EditorControlsContainer 
					toggleEditMode={this.toggleEditMode} 
					isEditModeActive={this.state.isEditModeActive}
				/>
				<AddButton toggleEditorTypeSelect={this.toggleEditorTypeSelect} />
				<div className="editor-editor-container">
					{this.state.content.map((content, i) => {
						let DynamicEditorType = dynamicEditorTypeList[content.editorType];
						return (
							<EditorTypeRow 
								key={i}
								index={i}
								reorderEditorIndexes={this.reorderEditorIndexes}
								isEditModeActive={this.state.isEditModeActive}
								removeEditorFromContainer={this.removeEditorFromContainer} >
								<DynamicEditorType
									content={content.content}
									key={i}
									index={i}
									componentTitle={content.componentTitle}
									updateComponentTitle={this.updateComponentTitle}
									updateParentStateContent={this.updateParentStateContent}
									isEditModeActive={this.state.isEditModeActive}
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