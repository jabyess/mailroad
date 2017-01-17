import AWS from 'aws-sdk/clients/s3'


class S3 {

	constructor() {
		console.log('s3 initialized')
		//initialize params in here to be used on every function call
		this.params = {}
	}

}

export default S3