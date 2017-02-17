import React from 'react'
import autoBind from 'react-autobind'
import EditorMetaContainer from './EditorMetaContainer.jsx'
import EditorTypeSelect from './editor-types/EditorTypeSelect.jsx'
import EditorTypeRow from './EditorTypeRow.jsx'
import ImagePromptModal from '../modals/ImagePromptModal.jsx'
import ImageGalleryModal from '../modals/ImageGalleryModal.jsx'
import LinkModal from '../modals/LinkModal.jsx'
import HTML5Backend from 'react-dnd-html5-backend'
import EditorControlsContainer from './EditorControlsContainer.jsx'
import PDB from '../../lib/pouchdb.js'
import axios from 'axios'
import { DragDropContext } from 'react-dnd'
import { debounce } from '../../lib/utils.js'
import { DefaultEditor, DatePicker, DatesPicker } from './editor-types/EditorTypes.js'

const dynamicEditorTypeList = {
	DefaultEditor,
	DatePicker,
	DatesPicker
}

class EditorContainer extends React.Component {
	constructor() {
		super()

		autoBind(this, 
			'createEmail',
			'saveToDB',
			'getEmailContents',
			'addEditorToContainer',
			'getEditorType',
			'reorderEditorIndexes',
			'compileHTMLTemplate',
			'handleTitleChange',
			'handleTemplateChange',
			'updateContentValue',
			'updateComponentTitle',
			'removeEditorFromContainer',
			'toggleImageGalleryModal',
			'toggleVisible',
			'getImageURL'
		)

		this.pouchDB = new PDB('emailbuilder')

		this.pouchDB.updateDoc = debounce(this.pouchDB.updateDoc, 2000, false)

		this.state = {
			template: '',
			templates: [],
			content: [],
			isEditorTypeSelectVisible: false,
			isEditModeActive: false,
			isGalleryModalVisible: false,
			isSaveButtonVisible: false,
			isExternalImageModalVisible: false,
			isImagePromptModalVisible: false,
			isLinkModalVisible: false
		}
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

	componentWillUnmount () {
		window.removeEventListener('toggleExternalImageModal', this.toggleExternalImageModal)
		window.removeEventListener('toggleVisible', this.toggleVisible)
	}

	componentWillReceiveProps (nextProps) {
		console.log('editorContainer nextprops:', nextProps)
	}

	componentDidUpdate() {
		this.pouchDB.updateDoc(this.state)
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

	updateContentValue(content, index) {
		console.log(content)
		this.setState(() => {
			this.state.content[index].content = content
		})
	}

	updateComponentTitle(title, index) {
		this.setState(() => { this.state.content[index].componentTitle = title })
	}

	getEditorType(editorList, eventDetail) {
		let newVal = Object.keys(editorList).filter((val) => {
			return val === eventDetail
		})
		return newVal[0]
	}

	getEmailContents(id) {
		console.log('getEmailContents running')
		console.log(id)
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
		}).then((jsonResponse) => {
			// let url = '/api/email/' + json.data.id
			console.log('createEmail json', jsonResponse)
			if(jsonResponse.data) {
				this.setState(jsonResponse.data)
			}
			// axios.get(url)
			// .then((contents) => {
			// 	console.log(contents)
			// 	this.setState(contents.data)
			// })
			// .catch((err) => {
			// 	console.log('error after createEmail, on response:', err)
			// })
		}, (rejected) => {
			console.log('error in createEmail post', rejected)
		})
		.catch((err) => {
			console.log('error during createEmail:', err)
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

	saveToDB() {
		this.pouchDB.syncToDB(this.state, (complete) => {
			console.log('complete', complete)
		})
	}

	toggleVisible(event) {
		let visibleKey = event.detail.toString()
		console.log(visibleKey)
		this.setState(() => {
			let returnObj = {}
			returnObj[visibleKey] = !this.state[visibleKey]
			return returnObj
		})
	}

	reorderEditorIndexes(oldIndex, newIndex) {
		this.setState(() => {
			let removed = this.state.content.splice(oldIndex, 1)
			this.state.content.splice(newIndex, 0, removed[0])
			return this.state.content
		})
	}

	toggleImageGalleryModal() {
		this.setState({isGalleryModalVisible: !this.state.isGalleryModalVisible})
	}

	getImageURL(url) {
		console.log(url)
	}
	
	render() {
		const renderImageGalleryModal = this.state.isGalleryModalVisible ? 
		<ImageGalleryModal
			toggleImageGalleryModal={this.toggleImageGalleryModal}
			isGalleryModalVisible={this.state.isGalleryModalVisible}
			getImageURL={this.getImageURL}
		/> : null

		const renderImagePromptModal = this.state.isImagePromptModalVisible ? <ImagePromptModal /> : null

		const renderEditorTypeSelect = this.state.isEditModeActive ? <EditorTypeSelect 

			addEditorToContainer={this.addEditorToContainer}
			/> : null
		const renderLinkModal = this.state.isLinkModalVisible ? <LinkModal /> : null
		
		return (
			<div className="editor-container">
				{renderImagePromptModal}
				{renderImageGalleryModal}
				{renderLinkModal}
				<EditorMetaContainer {...this.state} 
					handleTitleChange={this.handleTitleChange}
					handleTemplateChange={this.handleTemplateChange}
				/>
				<EditorControlsContainer 
					toggleEditMode={this.toggleEditMode} 
					isEditModeActive={this.state.isEditModeActive}
					saveToDB={this.saveToDB}
				/>
				{renderEditorTypeSelect}
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
									updateContentValue={this.updateContentValue}
									isEditModeActive={this.state.isEditModeActive}
									editorType={content.editorType}
								/>
							</EditorTypeRow>
						)
					})}
				</div>

			</div>
		)	
	}
}

EditorContainer.propTypes = {
	params: React.PropTypes.oneOfType([
		React.PropTypes.string,
		React.PropTypes.object
	])
}

export default DragDropContext(HTML5Backend)(EditorContainer)