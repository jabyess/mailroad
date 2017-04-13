import React from 'react'
import autoBind from 'react-autobind'
import axios from 'axios'


const IMAGES_PER_PAGE = 20

class ImageGalleryModal extends React.Component {
	constructor(props) {
		super(props)

		autoBind(this,
			'getImagesFromDB',
			'loadMore',
			'deleteImage',
			'updateMediaList',
			'setParentImageSizes'
		)

		this.state = {
			images: [],
			page: 1,
			loadMoreVisible: true,
		}
	}

	getImagesFromDB() {
		axios('/api/s3/list')
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
			axios.get('/api/s3/list/', {
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

	deleteImage(e) {
		let index = e.target.dataset.index
		let fileName = this.state.images[index].id
		console.log(fileName)
		axios.post('/api/s3/delete', {
			fileName
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
			const index = e.target.dataset.index
			const grouping = this.state.images[index].grouping
			const url = `/api/s3/list/${grouping}`

			axios.get(url).then((response) => {

				const imageSizes = response.data.docs.map(image => {
					return {
						size: image.size,
						url: image.url
					}
				})

				this.props.setImageSizes(imageSizes)
			})
			.catch((err) => {
				console.log('error in imagesize getting', err)
			})
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
			detail: 'isImageGalleryModalVisible'
		})
		const clearImageIndexURL = new CustomEvent('clearImageIndexURL')

		window.dispatchEvent(clearImageIndexURL)
		window.dispatchEvent(isImageGalleryModalVisible)
	}

	render() {
		return (
			<div className="modal is-active imageGalleryModal">
				<div className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">Image Gallery</p>
						<button className="modal-close" onClick={this.toggleVisible}></button>
					</header>
					<section className="modal-card-body imageGalleryModal__content">
						{this.state.images.map((image, index) => {
							const bgImage = {
								backgroundImage: 'url(' + image.url + ')'
							}
							return (
								<div
									className="imageGalleryModal__image" 
									style={bgImage}
									data-index={index}
									key={index}
									onClick={this.setParentImageSizes}
								>
									<button
										className="button imageGalleryModal__delete"
										onClick={this.deleteImage}
										data-index={index}
									>X</button>
								</div>
							)
						})}
					</section>
					<footer className="modal-card-foot">
						<button className="button imageGalleryModal__loadMore" onClick={this.loadMore}>Load More</button>
					</footer>
				</div>
			</div>
		) 
	}
}

ImageGalleryModal.propTypes = {
	setImageSizes: React.PropTypes.func
}

export default ImageGalleryModal