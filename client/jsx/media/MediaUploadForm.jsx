import React from 'react'
import PropTypes from 'prop-types'
import ImageSizeInputs from './ImageSizeInputs.jsx'
import autoBind from 'react-autobind'
import axiosClient from '../../lib/axios.js'
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
		
		// TODO: animate progress event
		// pass config into axios post
		// const config = {
		// 	onUploadProgress: (progressEvent) => {
		// 		this.props.setProgress( Math.round((progressEvent.loaded * 100) / progressEvent.total))
		// 	},
		// }

		if(this.state.droppedFiles) {
			const imageData = new FormData()
			this.state.droppedFiles.forEach((file) => {
				imageData.append('droppedFiles', file)
			})
			imageData.append('sizes', JSON.stringify(validatedSizes))

			axiosClient.post('/api/s3/create', imageData).then((res) => {
				//TODO: success popup
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
			this.setState({droppedFiles, sizeInputs})
		})

		if(rejectedFiles.length > 0) {
			window.alert(rejectedFiles.length + ' file(s) not loaded, either too big or wrong type')
		}
	}

	showGalleryModal() {
		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: {
				component: 'ImageGalleryModal',
				visible: true,
			}
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
		const imageSizeInputs = this.state.sizeInputs && this.state.sizeInputs.length > 0 ?
		<ImageSizeInputs
			droppedFiles={this.state.droppedFiles}
			startUpload={this.startUpload}
			sizeInputs={this.state.sizeInputs}
			handleHeightChange={this.handleHeightChange}
			handleWidthChange={this.handleWidthChange}
			resetSizes={this.resetSizes}
			addSizeRow={this.addSizeRow}
			removeSizeRow={this.removeSizeRow}
		/> : null

		return (
			<div className="mediaUploadForm columns">
				<div className="column">
					<button className="button is-info is-medium" onClick={this.showGalleryModal}>View Gallery</button>
					<Dropzone 
						className="mediaUploadForm__dropzone"
						onDrop={this.onDrop}
						multiple
						maxSize={2000000}
						accept={allowedFileTypes.join()}
					>
						<div>Click here or drag & drop your images</div>
					</Dropzone>
				</div>
				<div className="mediaUploadForm__inputs column">
					{imageSizeInputs}
				</div>
			</div>
		)
	}
}

MediaUploadForm.propTypes = {
	toggleImageGalleryModal: PropTypes.func
}

export default MediaUploadForm