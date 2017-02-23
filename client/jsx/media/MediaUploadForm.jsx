import React from 'react'
import ImageSizes from './ImageSizes.jsx'
import autoBind from 'react-autobind'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import Promise from 'bluebird'

const allowedFileTypes = [
	'image/jpeg',
	'image/png',
	'image/jpg',
	'image/gif',
	'image/bmp'
]

class MediaUploadForm extends React.Component {
	constructor() {
		super()
		
		autoBind(this,
		'startUpload',
		'addSizeRow',
		'removeSizeRow',
		'handleHeightChange',
		'handleWidthChange',
		'onDrop',
		'showGalleryModal'
		)

		this.state = {
			droppedFiles: [],
			percentCompleted: 0,
		}
	}

	startUpload() {
		//user inputted values need to be converted to int
		const validatedSizes = this.state.sizeInputs.map((imageSize) => {
			return imageSize.map(size => {
				return {
					width: parseInt(size.width, 10),
					height: parseInt(size.height, 10)
				}
			})
		})

		// const config = {
		// 	onUploadProgress: (progressEvent) => {
		// 		console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total))
		// 		this.setState({percentCompleted: Math.round((progressEvent.loaded * 100) / progressEvent.total)})
		// 	}
		// }

		if(this.state.droppedFiles) {
			const imageData = new FormData()
			this.state.droppedFiles.forEach((file) => {
				imageData.append('droppedFiles', file)
			})
			imageData.append('sizes', JSON.stringify(validatedSizes))

			axios.post('/api/s3/create', imageData).then((res) => {
				console.log(res)
				if(res.status === 200) {
					let triggerMediaListRefresh = new CustomEvent('triggerMediaListRefresh')
					window.dispatchEvent(triggerMediaListRefresh)
				}
			})
		}
	}

	onDrop(droppedFiles, rejectedFiles) {
		Promise.map(droppedFiles, (file) => {
			return new Promise((resolve) => {
				let newImage = new Image()
				newImage.src = window.URL.createObjectURL(file)
				newImage.onload = function() {
					const width = this.width
					const height = this.height
					resolve([{width, height}])
				}
			})
		}).then((sizeInputs) => {
			// console.log(sizeInputs)
			this.setState({droppedFiles, sizeInputs})
		})

		if(rejectedFiles.length > 0) {
			window.alert(rejectedFiles.length + ' file(s) not loaded, either too big or wrong type')
		}
	}

	showGalleryModal() {
		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: 'isImageGalleryModalVisible'
		})
		window.dispatchEvent(isImageGalleryModalVisible)
	}

	handleHeightChange(height, imageIndex, sizeIndex) {
		this.setState(state => state.sizeInputs[imageIndex][sizeIndex].height = height)
	}

	handleWidthChange(width, imageIndex, sizeIndex) {
		this.setState(state => state.sizeInputs[imageIndex][sizeIndex].width = width)
	}

	addSizeRow(imageIndex) {
		if(this.state.sizeInputs[imageIndex].length < 5) {
			this.setState(state => state.sizeInputs[imageIndex].push({height: '', width: ''}))
		}
	}

	removeSizeRow(imageIndex) {
		if(this.state.sizeInputs[imageIndex].length > 1 ) {
			this.setState(state => state.sizeInputs[imageIndex].pop())
		}
	}

	render() {
		const imageSizes = this.state.sizeInputs && this.state.sizeInputs.length > 0 ?
		<ImageSizes
			sizeInputs={this.state.sizeInputs}
			handleHeightChange={this.handleHeightChange}
			handleWidthChange={this.handleWidthChange}
			resetSizes={this.resetSizes}
			addSizeRow={this.addSizeRow}
			removeSizeRow={this.removeSizeRow}
		/> : null

		return (
			<div className="mediaUploadForm">
				<button className="button" onClick={this.showGalleryModal}>View Gallery</button>
				<Dropzone 
					className="mediaUploadForm__dropzone"
					onDrop={this.onDrop}
					multiple
					maxSize={2000000}
					accept={allowedFileTypes.join()}
				>
					<div>Drop your images here</div>
				</Dropzone>
				<div>{this.state.droppedFiles.map((file, i) => 
					<img key={i} src={file.preview} className="mediaUploadForm__img" />)}
				</div>
				{imageSizes}
				<input className="input" type="submit" onClick={this.startUpload} />
			</div>
		)
	}
}

MediaUploadForm.propTypes = {
	toggleImageGalleryModal: React.PropTypes.func
}

export default MediaUploadForm