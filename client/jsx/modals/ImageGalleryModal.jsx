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
			page: 1
		}
	}

	getImagesFromS3(hardRefresh) {	
		axios('/api/s3/list')
			.then((imageResponse) => {
				this.setState({allImages: imageResponse.data}, () => {
					if(hardRefresh) {
						this.setState({images: []}, this.initialLoad)
					}
					else {
						this.initialLoad()
					}
				})
			})
			.catch((err) => {
				console.error('error refreshing s3 images', err)
			})
	}

	initialLoad() {
		const maxLength = this.state.allImages.length
		const loopLength = maxLength < IMAGES_PER_PAGE ? maxLength : IMAGES_PER_PAGE
		this.setState(() => {
			for(let i = 0; i < loopLength; i++) {
				this.state.images.push(this.state.allImages[i])
			}
		}) 
	}

	loadMore() {
		const maxLength = this.state.allImages.length
		this.setState(() => {
			let index = IMAGES_PER_PAGE * this.state.page
			for(let i = index; i < index + IMAGES_PER_PAGE; i++) {
				if(i <= maxLength) {
					this.state.images.push(this.state.allImages[i])
				}
			}
			this.state.page = this.state.page++
		})
	}

	deleteImage(e) {
		let index = e.target.dataset.index
		let fileName = this.state.images[index].fileName
		console.log(fileName)
		axios.post('/api/s3/delete', {
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({key: fileName})
		}).then((response) => {
			return response.text()
		}).then((text) => {
			console.log(text)
			this.setState(() => {
				this.state.images.splice(index,1)
			})
		})
	}

	updateMediaList() {
		this.getImagesFromS3(true)
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
		return (
			<div className="imagesContainer">
				{images}
				<button className="imagesContainer--loadMore" onClick={this.loadMore}>Load More</button>
			</div>	
		)
		
	}
}

