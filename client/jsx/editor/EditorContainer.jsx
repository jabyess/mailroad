import React from 'react'
import autoBind from 'react-autobind'
import EditorMetaContainer from './EditorMetaContainer.jsx'
import EditorTypeSelect from './editor-types/EditorTypeSelect.jsx'
import shortid from 'shortid'
import EditorTypeRow from './EditorTypeRow.jsx'
import ImagePromptModal from '../modals/ImagePromptModal.jsx'
import ImageGalleryModal from '../modals/ImageGalleryModal.jsx'
import ImageSizeModal from '../modals/ImageSizeModal.jsx'
import LinkModal from '../modals/LinkModal.jsx'
import HTML5Backend from 'react-dnd-html5-backend'
import EditorControlsContainer from './EditorControlsContainer.jsx'
import PDB from '../../lib/pouchdb.js'
import axios from 'axios'
import { DragDropContext } from 'react-dnd'
import { debounce } from '../../lib/utils.js'

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
			'toggleVisible',
			'setImageSizes',
			'setImageURL',
			'setImageIndex',
			'clearImageIndexURL'
		)

		this.pouchDB = new PDB('emailbuilder')

		this.pouchDB.updateDoc = debounce(this.pouchDB.updateDoc, 2000, false)

		this.state = {
			template: '',
			templates: [],
			contents: [],
			componentTitles: ['Washington', 'Section', 'Energy', 'Tech']
		}
	}

	componentDidMount() {
		window.addEventListener('toggleVisible', this.toggleVisible)
		window.addEventListener('clearImageIndexURL', this.clearImageIndexURL)

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
		window.removeEventListener('toggleVisible', this.toggleVisible)
	}

	componentDidUpdate() {
		this.pouchDB.updateDoc(this.state)
	}

	addEditorToContainer(editorName) {
		editorName.forEach((currentEditor) => {
			this.setState({
				contents: this.state.contents.concat({
					content: '<p>New Editor</p>',
					editorType: currentEditor,
					id: shortid.generate()
				})
			})
		})
	}

	removeEditorFromContainer(index) {
		this.setState(() => {
			this.state.contents.splice(index, 1)
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
		this.setState((state) => {
			state.contents[index].content = content
		})
	}

	updateComponentTitle(title, index) {
		this.setState((state) => { state.contents[index].componentTitle = title })
	}

	getEditorType(editorList, eventDetail) {
		let newVal = Object.keys(editorList).filter((val) => {
			return val === eventDetail
		})
		return newVal[0]
	}

	getEmailContents(id) {
		this.pouchDB.getDoc(id, (doc) => {
			if(doc) {
				this.setState(doc)
			}
			else {
				console.error('no doc from getEmailContents')
			}
		})
	}

	getTemplates() {
		axios.get('/api/email/templates')
			.then((templates) => {
				this.setState({ templates: templates.data })
			})
			.catch((err) => {
				console.log('there was an error: ', err)
			})
	}

	createEmail() {
		let contents = [{
			content: '<p>Just start typing</p>',
			editorType: 'DefaultEditor',
			componentTitle: 'New Component',
			id: shortid.generate()
		}]
		let title = 'New Email'

		axios.post('/api/email/create', {
			contents, title
		})
		.then(jsonResponse => {
			console.log(jsonResponse.data)
			this.setState(jsonResponse.data, this.pouchDB.updateDoc(jsonResponse.data))
		},
		rejected => {
			console.error('error in createEmail post', rejected)
		})
		.catch(err => {
			console.log('error during createEmail:', err)
		})
	}

	compileHTMLTemplate() {
		let {contents, title, template} = this.state
		let context = { contents, title, template }
		axios.post('/api/email/compileTemplate', {
			context: JSON.stringify(context)
		})
		.then(text => {
			// TODO: toast popup success
			console.log(text)
		})
	}

	saveToDB() {
		this.pouchDB.syncToDB(this.state, (complete) => {
			// TODO: toast popup success
			console.log('complete', complete)
		})
	}

	toggleVisible(event) {
		let visibleKey = event.detail.toString()
		this.setState(() => {
			let visibleObj = {}
			visibleObj[visibleKey] = !this.state[visibleKey]
			return visibleObj
		})
	}

	reorderEditorIndexes(oldIndex, newIndex) {
		this.setState((state) => {
			const removed = state.contents.splice(oldIndex, 1)
			state.contents.splice(newIndex, 0, removed[0])
			return {contents: state.contents}
		})
	}

	setImageURL(imageURL) {
		this.setState({ imageURL })
	}

	setImageSizes(imageSizes) {
		const isImageSizeModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageSizeModalVisible'
		})
		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageGalleryModalVisible'
		})

		this.setState({ imageSizes }, () => {
			window.dispatchEvent(isImageSizeModalVisible)
			window.dispatchEvent(isImageGalleryModalVisible)
		})
	}

	setImageIndex(imageIndex) {
		this.setState({ imageIndex })
	}

	clearImageIndexURL() {
		this.setState({ imageIndex: null, imageURL: null})
	}

	render() {
		const renderImageGalleryModal = this.state.isImageGalleryModalVisible ? 
		<ImageGalleryModal
			setImageSizes={this.setImageSizes}
		/> : null
		const renderImagePromptModal = this.state.isImagePromptModalVisible ? <ImagePromptModal /> : null
		const renderEditorTypeSelect = this.state.isEditModeActive ? <EditorTypeSelect
			addEditorToContainer={this.addEditorToContainer}
			/> : null
		const renderLinkModal = this.state.isLinkModalVisible ? <LinkModal /> : null
		const renderImageSizeModal = this.state.isImageSizeModalVisible ? <ImageSizeModal
			imageSizes={this.state.imageSizes}
			isImageSizeModalVisible={this.state.isImageSizeModalVisible}
			setImageURL={this.setImageURL}
		/> : null
		
		return (
			<div className="editor-container">
				{renderImagePromptModal}
				{renderImageGalleryModal}
				{renderImageSizeModal}
				{renderLinkModal}
				<EditorMetaContainer {...this.state}
					handleTitleChange={this.handleTitleChange}
					handleTemplateChange={this.handleTemplateChange}
				/>
				<EditorControlsContainer
					toggleEditMode={this.toggleEditMode}
					isEditModeActive={this.state.isEditModeActive}
					saveToDB={this.saveToDB}
					compileHTMLTemplate={this.compileHTMLTemplate}
				/>
				{renderEditorTypeSelect}
				<div className="editor-container__editors">
					{this.state.contents.map((content, i) => {
						return (
							<EditorTypeRow
								key={content.id}
								index={i}
								content={content.content}
								editorType={content.editorType}
								componentTitle={content.componentTitle}
								imageURL={this.state.imageURL}
								imageIndex={this.state.imageIndex}
								setImageIndex={this.setImageIndex}
								isEditModeActive={this.state.isEditModeActive}
								removeEditorFromContainer={this.removeEditorFromContainer}
								componentTitles={this.state.componentTitles}
								updateComponentTitle={this.updateComponentTitle}
								updateContentValue={this.updateContentValue}
								reorderEditorIndexes={this.reorderEditorIndexes}
							/>
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