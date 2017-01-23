
import React from 'react'

export default class MediaUploadForm extends React.Component {
	constructor() {
		super()
		
		this.handleFileUpload = this.handleFileUpload.bind(this)
	}

	handleFileUpload(e) {
		let formData = new FormData()
		console.log(e.target.files)
		
		let imageFile = e.target.files[0]
		formData.append('file', imageFile)

		fetch('/api/s3/create', {
			method : 'POST',
			body: formData
		}).then((response) => {
			return response
		})
		.then((res)=>{
			console.log(res.status)
			if(res.status === 200) {
				let triggerMediaListRefresh = new CustomEvent()
				window.dispatchEvent(triggerMediaListRefresh)
			}
		})
	}

	render() {
		return (
			<input type="file" onChange={this.handleFileUpload}/>
		)
	}
}