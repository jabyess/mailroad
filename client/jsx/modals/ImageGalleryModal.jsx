import React from 'react'
import autoBind from 'react-autobind'
import axios from 'axios'

const IMAGES_PER_PAGE = 10

export default class ImageGalleryModal extends React.Component {
	constructor() {
		super()

		autoBind(this,
			'getImagesFromS3',
			'loadMore',
			'initialLoad',
			'deleteImage',
			'updateMediaList'
		)

		this.state = {
			images: [],
			page: 1,
			loadMoreVisible: true,
		}
	}

	getImagesFromS3() {
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
		}).then((text) => {
			console.log(text)
		})
	}

	updateMediaList() {
		this.getImagesFromS3()
	}

	componentDidMount () {
		this.getImagesFromS3()
		window.addEventListener('triggerMediaListRefresh', this.updateMediaList)
	}

	componentWillUnmount () {
		window.removeEventListener('triggerMediaListRefresh', this.updateMediaList)
	}
	

	render() {
		const images = this.state.images ? this.state.images.map((image, index) => {
			const bgImage = {
				backgroundImage: 'url(' + image.url + ')'
			}
			return (
				<div className="imagesContainer--image" style={bgImage} key={index} >
					<button className="imagesContainer--delete" onClick={this.deleteImage} data-index={index}>x</button>
				</div>
			)
		}) : null
		const loadMoreVisible = this.state.loadMoreVisible ? <button className="imagesContainer--loadMore" onClick={this.loadMore}>Load More</button>  : null
		return (
			<div className="imagesContainer">
				{images}
				{loadMoreVisible}
			</div>	
		)
		
	}
}

