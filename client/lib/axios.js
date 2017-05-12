import axios from 'axios'
import { browserHistory } from 'react-router'

const statusCodes = [
	200,
	201,
	202,
	203,
	204,
	205,
	206,
	207,
	208,
	226,
	403
]

let axiosClient = axios.create({
	timeout: 2000,
	headers: {
		'X-Requested-With': 'XMLHttpRequest'
	},
	validateStatus: (status) => {
		if(statusCodes.some(s => s === status)) {
			return true
		}
		else return false
	}
})

axiosClient.interceptors.response.use((res) => {
	if(res.status === 403) {
		browserHistory.replace('/login')
		return res
	}
	else return res

}, (err) => {
	console.log('error intercepting', err)
})

export default axiosClient