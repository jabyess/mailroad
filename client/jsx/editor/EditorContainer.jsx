import React from 'react'
import autoBind from 'react-autobind'
import EditorMetaContainer from './EditorMetaContainer.jsx'
import EditorTypeSelect from './editor-types/EditorTypeSelect.jsx'
import EditorTypeRow from './EditorTypeRow.jsx'
import ImagePromptModal from '../modals/ImagePromptModal.jsx'
import ImageGalleryModal from '../modals/ImageGalleryModal.jsx'
import HTML5Backend from 'react-dnd-html5-backend'
import EditorControlsContainer from './EditorControlsContainer.jsx'
import CompileHTMLButton from './CompileHTMLButton.jsx'
import SaveButton from './SaveButton.jsx'
import NavBar from '../NavBar.jsx'
import PDB from '../../lib/pouchdb.js'
import axios from 'axios'
import { DragDropContext } from 'react-dnd'
import { debounce } from '../../lib/utils.js'
import { SlateEditor, DefaultEditor, DatePicker, DatesPicker } from './editor-types/EditorTypes.js'

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
			'compileHTMLTemplate',
			'handleTitleChange',
			'handleTemplateChange',
			'updateParentStateContent',
			'updateComponentTitle',
			'removeEditorFromContainer',
			'toggleVisible'
		)

		this.pouchDB = new PDB('emailbuilder')

		this.pouchDB.updateDoc = debounce(this.pouchDB.updateDoc, 2000)

		this.state = {
			template: '',
			templates: [],
			content: [],
			isEditorTypeSelectVisible: false,
			isEditModeActive: false,
			isGalleryModalVisible: false,
			isExternalImageModalVisible: false,
			isImagePromptModalVisible: false
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
		this.setState(() => {
			this.state.content[index].content = content
		}, () => { console.log(this.state.content[index].content )})
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
		console.log('getEmailContents running')
		this.pouchDB.getDoc(id, (doc) => {
			if(doc) {
				console.log('getEmailContents doc', doc)
				this.setState(doc)
			}
			else {
				console.log('no doc')
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
			componentTitle: 'New Component'
		}]
		let title = 'New Email'

		axios.post('/api/email/create', {
			content: content,
			title: title
		}).then((json) => {
			let url = '/api/email/' + json.data.id
			axios.get(url)
			.then((contents) => {
				this.setState(contents.data)
			})
			.catch((err) => {
				console.log('error after createEmail, on response:', err)
			})
		})
		.catch((err) => {
			console.log("error during createEmail:", err)
		})
	}

	compileHTMLTemplate() {
	 	let {content, title, template} = this.state
		let context = { content, title, template }
		fetch('/api/compileTemplate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(context)
		})
		.then((response) => {
			return response.text()
		})
		.then((text) => {
			console.log(text)
		})
	}

	updateEmail() {
		let url = `/api/email/${this.state._id}`
		axios.post(url, {
			content: this.state.content,
			title: this.state.title,
			template: this.state.template,
		}).then((json) => {
			console.log(json)
			// success toast popup
		})
	}

	toggleVisible(event) {
		let visibleKey = event.detail.toString()
		this.setState(() => {
			let returnObj = {}
			returnObj[visibleKey] = !this.state[visibleKey]
			return returnObj
		})
	}

	componentDidMount() {
		window.addEventListener('toggleVisible', this.toggleVisible)

		this.getTemplates()

		//if we have an ID from react-router, make db call to get data
		if(this.props.params.id) {
			this.getEmailContents(this.props.params.id)
		}

		//if we have no ID from react-router, create new email instance
		if(!this.props.params.id) {
			this.createEmail()
		}
	}

	reorderEditorIndexes(oldIndex, newIndex) {
		this.setState(() => {
			let removed = this.state.content.splice(oldIndex, 1)
			this.state.content.splice(newIndex, 0, removed[0])
			return this.state.content
		})
	}
	
	componentWillUnmount () {
		window.removeEventListener('toggleExternalImageModal', this.toggleExternalImageModal)
		window.removeEventListener('toggleVisible', this.toggleVisible)
	}

	componentDidUpdate() {
		this.pouchDB.updateDoc(this.state)
	}

	render() {
		const renderImageGalleryModal = this.state.isGalleryModalVisible ? <ImageGalleryModal /> : null
		const renderImagePromptModal = this.state.isImagePromptModalVisible ? <ImagePromptModal /> : null
		const renderEditorTypeSelect = this.state.isEditModeActive ? <EditorTypeSelect 
			addEditorToContainer={this.addEditorToContainer}
			/> : null
		return (
			<div className="editor-container">
				<NavBar />
				<EditorMetaContainer {...this.state} 
					handleTitleChange={this.handleTitleChange}
					handleTemplateChange={this.handleTemplateChange}
				/>
				<EditorControlsContainer 
					toggleEditMode={this.toggleEditMode} 
					isEditModeActive={this.state.isEditModeActive}
				/>
				<div className="editor-editor-container">
					{this.state.content.map((content, i) => {
						let DynamicEditorType = dynamicEditorTypeList[content.editorType]
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
				{renderEditorTypeSelect}
				{renderImagePromptModal}
				{renderImageGalleryModal}
				<SaveButton saveToDB={this.saveToDB} />
				<CompileHTMLButton compileHTMLTemplate={this.compileHTMLTemplate} />
			</div>
		)	
	}
}

export default DragDropContext(HTML5Backend)(EditorContainer);