import React from 'react'
import PropTypes from 'prop-types'
import autoBind from 'react-autobind'
import axiosClient from '../../lib/axios.js'
import ImageGalleryImages from './ImageGalleryImages.jsx'
import ImageGalleryPane from './ImageGalleryPane.jsx'

const IMAGES_PER_PAGE = 20

class ImageGalleryModal extends React.Component {
	constructor(props) {
		super(props)

		autoBind(this,
			'getImagesFromDB',
			'loadMore',
			'deleteImage',
			'updateMediaList',
			'setParentImageSizes',
			'getImageInfo',
			'setActiveImage',
		)

		this.state = {
			images: [],
			page: 1,
			loadMoreVisible: true,
		}
	}

	getImagesFromDB() {
		axiosClient('/api/s3/list')
			.then((imageResponse) => {
				this.setState({
					images: imageResponse.data.images,
					totalRows: imageResponse.data.totalRows,
				})
			})
			.catch((err) => {
				console.error('error refreshing s3 images', err)
			})
	}

	loadMore() {
		if(this.state.images.length < this.state.totalRows) {
			axiosClient.get('/api/s3/list/', {
				params: {
					skip: this.state.page * IMAGES_PER_PAGE
				}
			}).then((imageResponse) => {
				const maxLength = imageResponse.data.images.length
				const loopLength = maxLength <= this.state.images.length ? maxLength : this.state.totalRows - this.state.images.length
				this.setState((state) => {
					for(let i = 0; i < loopLength; i++) {
						state.images.push(imageResponse.data.images[i])
					}
					this.state.page = this.state.page++
				})
			})
		}
	}

	deleteImage() {
		let index = this.state.activeImage
		let grouping = this.state.images[index].grouping
		axiosClient.post('/api/s3/delete', {
			grouping
		}).then((deleteResponse) => {
			if(deleteResponse.status === 200) {
				this.updateMediaList()
			}
		}).catch(err => {
			console.error('error deleting image', err)
			throw err
		})
	}

	setParentImageSizes(e) {
		e.persist()
		if(this.props.setImageSizes) {
			const imageSizes = this.state.currentImage.sizes
			this.props.setImageSizes(imageSizes)
		}
	}

	updateMediaList() {
		this.getImagesFromDB()
	}

	componentDidMount () {
		this.getImagesFromDB()
		window.addEventListener('triggerMediaListRefresh', this.updateMediaList)
	}

	componentWillUnmount () {
		window.removeEventListener('triggerMediaListRefresh', this.updateMediaList)
	}

	toggleVisible() {
		const isImageGalleryModalVisible = new CustomEvent('toggleVisible', {
			detail: { 
				component: 'ImageGalleryModal',
				visible: false
			}
		})

		window.dispatchEvent(isImageGalleryModalVisible)
	}

	setActiveImage(index) {
		this.setState({ activeImage: parseInt(index, 10) })
	}

	getImageInfo(grouping) {
		axiosClient.get(`/api/s3/list/${grouping}`)
			.then(images => {
				const docs = images.data.docs
				const sizes = docs.map(d => ({size: d.size, id: d._id, url: d.url}))
				const currentImage = {
					date: docs[0].date,
					filename: docs[0].filename,
					sizes: sizes
				}

				this.setState({ currentImage })
			})
			.catch(err => {
				console.error(err)
			})
	}

	render() {
		return (
			<div className="imageGalleryModal">
				<div className="modal-background" onClick={this.toggleVisible}></div>
				<div className="imageGalleryModal__content">
					<ImageGalleryImages
						images={this.state.images}
						getImageInfo={this.getImageInfo}
						setActiveImage={this.setActiveImage}
						activeImage={this.state.activeImage}
					/>
					<ImageGalleryPane
						{...this.props}
						currentImage={this.state.currentImage}
						toggleVisible={this.toggleVisible}
						deleteImage={this.deleteImage}
						loadMore={this.loadMore}
						loadMoreVisible={this.state.loadMoreVisible}
						activeImage={this.state.activeImage}
					/>
				</div>
			</div>
		) 
	}
}

ImageGalleryModal.propTypes = {
	setImageSizes: PropTypes.func

}

export default ImageGalleryModal