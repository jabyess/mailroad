import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import autoBind from 'react-autobind'
import EditorMetaContainer from './EditorMetaContainer'
import EditorTypeSelect from './editor-types/EditorTypeSelect'
import shortid from 'shortid'
import EditorTypeContainer from './EditorTypeContainer'
import ImagePromptModal from '../modals/ImagePromptModal'
import ImageGalleryModal from '../modals/ImageGalleryModal'
import SourceModal from '../modals/SourceModal'
import ExternalImageModal from '../modals/ExternalImageModal'
import LinkModal from '../modals/LinkModal'
import HTML5Backend from 'react-dnd-html5-backend'
import EditorControlsContainer from './EditorControlsContainer'
import PDB from '../../lib/pouchdb'
import axiosClient from '../../lib/axios.js'
import { DragDropContext } from 'react-dnd'
import { debounce, formatTimestamp } from '../../lib/utils'

class EditorContainer extends React.Component {
	constructor() {
		super()

		autoBind(this,
			'createEmail',
			'saveToDB',
			'getEmailContents',
			'addEditorToContainer',
			'getEditorType',
			'getCategories',
			'updateCategory',
			'filterComponentTitles',
			'reorderEditorIndexes',
			'compileHTMLTemplate',
			'handleTitleChange',
			'handleTemplateChange',
			'handleAuthorChange',
			'updateContentValue',
			'updateComponentTitle',
			'removeEditorFromContainer',
			'toggleVisible',
			'setImageURL',
			'setImageIndex',
			'clearImageIndexURL',
			'extractFromState'
		)

		this.pouchDB = new PDB('emailbuilder')

		this.pouchDB.updateDoc = debounce(this.pouchDB.updateDoc, 2000, false)

		this.state = {
			template: '',
			templates: [],
			contents: [],
			categories: [],
			category: '',
			visible: {}
		}
	}

	componentDidMount() {
		window.addEventListener('toggleVisible', this.toggleVisible)
		window.addEventListener('clearImageIndexURL', this.clearImageIndexURL)

		this.getTemplates()
		this.getCategories()

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
		window.removeEventListener('clearImageIndexURL', this.clearImageIndexURL)
	}

	componentDidUpdate() {
		let doc = this.extractFromState(this.state)
		this.pouchDB.updateDoc(doc)
	}

	addEditorToContainer(editorNames) {
		// set default values for different component types when adding to editorContainer
		const insertHTMLString = ['DefaultEditor']
		const insertArray = ['FlexibleImage']
		const insertArrayObj = ['EventsCalendar', 'SingleHeading']
		const insertObj = ['SingleImage']
		let content

		editorNames.forEach(currentEditor => {
			if(insertHTMLString.some(editorName => currentEditor === editorName)) {
				content = '<p>You have inserted a new editor.</p>'
			}
			else if(insertArray.some(editorName => currentEditor === editorName)) {
				content = []
			}
			else if(insertArrayObj.some(editorName => currentEditor === editorName)) {
				content = [{}]
			}
			else if(insertObj.some(editorName => currentEditor === editorName)) {
				content = {}
			}
			else {
				content = ''
			}
			this.setState({
				contents: this.state.contents.concat({
					content: content,
					editorType: currentEditor,
					id: shortid.generate()
				})
			})
		
		})
	}

	getCategories() {
		axiosClient.get('/api/meta/loadConfig', {
			params: {
				config: 'categories'
			}
		})
		.then((response) => {
			this.setState({categories: response.data.categories})
		})
		.catch(err => {
			this.fireNotification('danger', `Error getting categories: ${err}`)
		})
	}

	updateCategory(category) {
		this.setState({ category })
	}

	removeEditorFromContainer(index) {
		this.setState(() => {
			this.state.contents.splice(index, 1)
		})
	}

	handleAuthorChange(author) {
		this.setState({ author })
	}

	handleTitleChange(title) {
		this.setState({ title })
	}

	handleTemplateChange(template) {
		this.setState({ template })
	}

	fireNotification(type, text) {
		const newEvent = new CustomEvent('MRNotification', {
			detail: { 
				type, text
			}
		})
		window.dispatchEvent(newEvent)
	}

	updateContentValue(content, index) {
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
		axiosClient.get('/api/email/templates')
			.then((templates) => {
				this.setState({ templates: templates.data })
			})
			.catch((err) => {
				this.fireNotification('danger', err)
			})
	}

	createEmail() {
		let contents = [{
			content: '<p>Just start typing</p>',
			editorType: 'DefaultEditor',
			componentTitle: '',
			id: shortid.generate()
		}]
		let title = 'New Email'

		axiosClient.post('/api/email/create', {
			contents, title
		})
		.then(jsonResponse => {
			this.setState(jsonResponse.data, this.pouchDB.updateDoc(jsonResponse.data))
		},
		rejected => {
			this.fireNotification('danger', `Error creating email: ${rejected}`)
		})
		.catch(err => {
			this.fireNotification('danger', `Caught error creating email: ${err}`)
		})
	}

	compileHTMLTemplate() {
		let {contents, title, template} = this.state
		const context = { contents, title, template }
		axiosClient.post('/api/email/compile', {
			context: JSON.stringify(context)
		})
		.then(text => {
			this.setState({compiledEmail: text.data})
			this.fireNotification('success', 'Compiled Successfully')
		})
		.catch(err => {
			this.fireNotification('warning', 'Problem compiling template')
			console.log('error compiling email', err)
		})
	}

	extractFromState(state) {
		let { _id, _rev, author, category, contents, createdAt, updatedAt, template, title } = state
		let doc = {
			_id, _rev, author, category, contents, createdAt, updatedAt, template, title
		}
		return doc
	}

	saveToDB() {
		let doc = this.extractFromState(this.state)
		
		if(window.location.pathname.indexOf(doc._id) < 0) {
			browserHistory.push(window.location.pathname + '/' + doc._id)
		}

		this.pouchDB.syncToDB(doc, (complete) => {
			if(complete.status === 'complete') {
				this.fireNotification('success', 'Saved to Database')
			}
			else {
				this.fireNotification('warning', complete.status)
			}
		})
	}

	toggleVisible(event) {
		const { component, visible } = event.detail
		this.setState((state) => {
			return state.visible[component] = visible
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

	setImageIndex(imageIndex) {
		this.setState({ imageIndex })
	}

	clearImageIndexURL() {
		this.setState({ imageIndex: null, imageURL: null })
	}

	filterComponentTitles() {
		if(this.state.categories && this.state.category && this.state.categories.length > 0) {
			const categories = this.state.categories.filter((cat) => {
				return cat.name === this.state.category
			})
			const titles = categories.map((title) => {
				return title.componentTitles
			})
			return titles[0]
		}
	}

	render() {
		const renderImageGalleryModal = this.state.visible.ImageGalleryModal ? 
		<ImageGalleryModal
			setImageURL={this.setImageURL}
		/> : null

		const renderImagePromptModal = this.state.visible.ImagePromptModal ? 
		<ImagePromptModal /> : null

		const renderEditorTypeSelect = this.state.visible.isEditModeActive ? 
		<EditorTypeSelect
			addEditorToContainer={this.addEditorToContainer}
			fireNotification={this.fireNotification}
			/> : null

		const renderLinkModal = this.state.visible.LinkModal ? 
		<LinkModal /> : null

		const renderExternalImageModal = this.state.visible.ExternalImageModal ? 
			<ExternalImageModal 
				setImageURL={this.setImageURL}
				isExternalImageModalVisible={this.state.visible.ExternalImageModal}
			/>
		: null

		const renderSourceModal = this.state.visible.SourceModal ? 
		<SourceModal 
			textContent={this.state.compiledEmail}
		/> : null

		const componentTitles = this.filterComponentTitles()
		
		return (
			<div className="editor-container columns">
				{renderImagePromptModal}
				{renderImageGalleryModal}
				{renderLinkModal}
				{renderExternalImageModal}
				{renderSourceModal}
				<EditorTypeContainer 
					contents={this.state.contents}
					componentTitles={componentTitles}
					imageURL={this.state.imageURL}
					imageIndex={this.state.imageIndex}
					setImageIndex={this.setImageIndex}
					isEditModeActive={this.state.visible.isEditModeActive}
					removeEditorFromContainer={this.removeEditorFromContainer}
					updateComponentTitle={this.updateComponentTitle}
					updateContentValue={this.updateContentValue}
					reorderEditorIndexes={this.reorderEditorIndexes}
				/>
				<div className="column is-one-third">
					<EditorMetaContainer 
						{...this.state}
						createdAt={formatTimestamp(this.state.createdAt)}
						updatedAt={formatTimestamp(this.state.updatedAt)}
						handleTitleChange={this.handleTitleChange}
						handleTemplateChange={this.handleTemplateChange}
						handleAuthorChange={this.handleAuthorChange}
						updateCategory={this.updateCategory}
					/>
					<EditorControlsContainer
						toggleEditMode={this.toggleEditMode}
						isEditModeActive={this.state.visible.isEditModeActive}
						saveToDB={this.saveToDB}
						compileHTMLTemplate={this.compileHTMLTemplate}
					/>
					{renderEditorTypeSelect}
				</div>
			</div>
		)	
	}
}

EditorContainer.propTypes = {
	params: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	])
}

export default DragDropContext(HTML5Backend)(EditorContainer)