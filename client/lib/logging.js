import axios from 'axios'

class Logging {

	static log(level, data) {
		axios.post('/api/log', {
			data: {
				level, data
			}
		})
		.then(success => success)
		.catch(err => err)
	}

}

export default Logging