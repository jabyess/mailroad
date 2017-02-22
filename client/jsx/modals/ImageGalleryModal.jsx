import React from 'react'
import autoBind from 'react-autobind'
import axios from 'axios'

const IMAGES_PER_PAGE = 10

class ImageGalleryModal extends React.Component {
	constructor(props) {
		super(props)

		autoBind(this,
			'getImagesFromDB',
			'loadMore',
			'deleteImage',
			'updateMediaList',
			'setImageURL'
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

	setImageURL(e) {
		e.persist()
		const index = e.target.dataset.index
		const url = this.state.images[index].url
		this.props.setImageURL(url)
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

	render() {
		const isGalleryModalVisible = this.props.isGalleryModalVisible ? 
		(
			<div className="modal imagesContainer">
				<div className="modal-background"></div>
				<div className="modal-content imagesContainer--content">
					{this.state.images.map((image, index) => {
						const bgImage = {
							backgroundImage: 'url(' + image.url + ')'
						}
						return (
							<div 
								className="imagesContainer--image" 
								style={bgImage}
								data-index={index}
								key={index}
								onClick={this.setImageURL}
							>
								<button
									className="button imagesContainer--delete"
									onClick={this.deleteImage}
									data-index={index}
								>X</button>
							</div>
						)
					})}
					<button className="button imagesContainer--loadMore" onClick={this.loadMore}>Load More</button>
				</div>
				<button className="modal-close" onClick={this.props.toggleImageGalleryModal}></button>
			</div>
		) : null

		return (<div>{isGalleryModalVisible}</div>)
	}
}

ImageGalleryModal.propTypes = {
	isGalleryModalVisible: React.PropTypes.bool,
	setImageURL: React.PropTypes.func,
	toggleImageGalleryModal: React.PropTypes.func,
}

export default ImageGalleryModal