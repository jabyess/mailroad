import React from 'react'
import { browserHistory } from 'react-router'
import NavBar from './NavBar.jsx'
import axios from 'axios'


class App extends React.Component {
	constructor() {
		super()
	}

	doLogout() {
		const sessionToken = localStorage.getItem('mailroad-session-token')

		axios.delete(`/api/auth/${sessionToken}`)
		.then((deleted) => {
			if(deleted) {
				browserHistory.push('/login')
				localStorage.removeItem('mailroad-session-token')
			}
		}, () => {
			browserHistory.push('/login')
			localStorage.removeItem('mailroad-session-token')
		})
		.catch(err => {
			// TODO: send error log to endpoint
			console.log('err', err)
		})

		
	}
	
	render() {
		return (
			<div>
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