import React from 'react'
import { browserHistory } from 'react-router'
import NavBar from './NavBar.jsx'
import axiosClient from '../lib/axios.js'
import NotificationContainer from './NotificationContainer'


class App extends React.Component {
	constructor() {
		super()
	}

	doLogout() {
		axiosClient.get('/api/auth/logout')
			.then(status => {
				console.log(status)
				browserHistory.push('/login')
			})
			.catch(err => {
				axiosClient.post('/api/log', {
					level: 'error',
					data: err
				})
			})
	}
	
	render() {
		return (
			<div>
				<NotificationContainer />
				<div className="app-nav">
					<NavBar doLogout={this.doLogout} />
				</div>
				<div className="app-content">
					
					<div className="container is-fluid">
						{this.props.children}
					</div>
				</div>
				
			</div>
		)
	}
}

App.propTypes = {
	children: React.PropTypes.element
}

export default App