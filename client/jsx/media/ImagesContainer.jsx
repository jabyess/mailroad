import React from 'react'
import autoBind from 'react-autobind'

const IMAGES_PER_PAGE = 10

export default class ImagesContainer extends React.Component {
	constructor() {
		super()

		autoBind(this,
			'getImagesFromS3',
			'loadMore',
			'initialLoad',
			'deleteImage',
			'updateMediaList'
		)

		this.getImagesFromS3 = this.getImagesFromS3.bind(this)
		this.loadMore = this.loadMore.bind(this)
		this.initialLoad = this.initialLoad.bind(this)

		this.state = {
			images: [],
			page: 1
		}
	}

	getImagesFromS3(hardRefresh) {	
		fetch('/api/s3/list')
			.then((results) => {
				return results.json()
			})
			.then((json) => {
				this.setState({allImages: json}, () => {
					console.log(this.state.allImages)
					if(hardRefresh) {
						this.setState({images: []}, this.initialLoad)
					}
					else {
						this.initialLoad()
					}
				})
			})
	}

	initialLoad() {
		this.setState(()=>{
			for(let i = 0; i < IMAGES_PER_PAGE; i++) {
				this.state.images.push(this.state.allImages[i])
			}
		}) 
	}

	loadMore() {
		this.setState(() => {
			let index = IMAGES_PER_PAGE * this.state.page
			console.log(index)
			for(let i = index; i < index + IMAGES_PER_PAGE; i++) {
				console.log(this.state.allImages[index])
				this.state.images.push(this.state.allImages[i])
			}
			this.state.page = this.state.page++
		})
	}

	deleteImage(e) {
		let index = e.target.dataset.index
		let fileName = this.state.images[index].fileName
		console.log(fileName)
		fetch('/api/s3/delete', {
				method: 'POST',
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
		return (
			<div className="imagesContainer">
				{this.state.images.map((image, index) => {
					return (
						<div className="imagesContainer--image" key={index} >
							<img src={image.url} alt=""/>
							<button onClick={this.deleteImage} data-index={index}>x</button>
						</div>
					)
				})}
				<button className="imagesContainer--loadMore" onClick={this.loadMore}>Load More</button>
			</div>	
		)
		
	}
}

