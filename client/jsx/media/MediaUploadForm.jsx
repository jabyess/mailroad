import React from 'react'
import ImageSizes from './ImageSizes.jsx'
import autoBind from 'react-autobind'
import axios from 'axios'
import Dropzone from 'react-dropzone'

const allowedFileTypes = [
	'image/jpeg',
	'image/png',
	'image/jpg',
	'image/gif',
	'image/bmp'
]

export default class MediaUploadForm extends React.Component {
	constructor() {
		super()
		
		autoBind(this,
		'startUpload',
		'addSizeRow',
		'removeSizeRow',
		'handleHeightChange',
		'handleWidthChange',
		'resetSizes',
		'onDrop'
		)

		this.state = {
			sizeInputs : [{height: '', width: ''}],
			droppedFiles: [],
			percentCompleted: 0,
		}
	}

	startUpload() {
		//validate inputs first
		const validatedSizes = this.state.sizeInputs.map((size) => {
			const height = parseInt(size.height, 10)
			const width = parseInt(size.width, 10)
			return { height, width }
		})

		if(this.state.droppedFiles) {
			const formData = new FormData()
			this.state.droppedFiles.forEach((file) => {
				formData.append('droppedFile', file)
			})
			formData.append('sizes', JSON.stringify(validatedSizes))
			console.log(validatedSizes)
			console.log(formData)
			const config = {
				onUploadProgress: (progressEvent) => {
					this.setState({percentCompleted: Math.round((progressEvent.loaded * 100) / progressEvent.total)})
				}
			}
			axios.post('/api/s3/create', formData, config).then((response) => {
				return response
			})
			.then((res) => {
				console.log(res.status)
				if(res.status === 200) {
					let triggerMediaListRefresh = new CustomEvent('triggerMediaListRefresh')
					window.dispatchEvent(triggerMediaListRefresh)
				}
			})
		}
	}

	onDrop(droppedFiles, rejectedFiles) {
		console.log(droppedFiles)
		this.setState({droppedFiles})
		if(rejectedFiles.length > 0) {
			window.alert(rejectedFiles.length + ' file(s) rejected, either too big or wrong type')
		}
	}

	handleHeightChange(height, index) {
		this.setState((state) => state.sizeInputs[index].height = height)
	}
	
	handleWidthChange(width, index) {
		this.setState((state) => state.sizeInputs[index].width = width)
	}

	addSizeRow() {
		if(this.state.sizeInputs.length < 5) {
			this.setState((state) => {
				return state.sizeInputs.push({height: '', width: ''})
			})
		}
	}

	removeSizeRow() {
		if(this.state.sizeInputs.length > 1 ) {
			this.setState((state) => {
				return state.sizeInputs.pop()
			})
		}
	}

	resetSizes() {
		this.setState({sizeInputs: [{height: '', width: ''}]})
	}

	render() {
		return (
			<div className="mediaUploadForm">
				<Dropzone 
					className="mediaUploadForm__dropzone"
					onDrop={this.onDrop}
					multiple
					maxSize={200000000}
					accept={allowedFileTypes.join()}
				>
					<div>Drop your images here</div>
				</Dropzone>
				<div>{this.state.droppedFiles.map((file, i) => 
					<img key={i} src={file.preview} className="mediaUploadForm__img" />)}
				</div>
				<ImageSizes
					sizeInputs={this.state.sizeInputs}
					addSizeRow={this.addSizeRow}
					handleHeightChange={this.handleHeightChange}
					handleWidthChange={this.handleWidthChange}
					resetSizes={this.resetSizes}
					removeSizeRow={this.removeSizeRow}
				/>
			
				<input type="submit" onClick={this.startUpload} />
			</div>
		)
	}
}