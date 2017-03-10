import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App.jsx'
import EditorContainer from './editor/EditorContainer.jsx'
import EmailContainer from './emails/EmailContainer.jsx'
import AdminContainer from './admin/AdminContainer.jsx'
import MediaContainer from './media/MediaContainer.jsx'
import LoginContainer from './login/LoginContainer.jsx'
import autoBind from 'react-autobind'
import axios from 'axios'


class MailRoadRouter extends React.Component {
	constructor() {
		super()

		autoBind(this,
			'requireAuth'
		)
	}

	requireAuth(nextState, replace, callback) {
		const sessionToken = localStorage.getItem('mailroad-session-token')
		// if no localStorage token, redirect to login
		if(!sessionToken) {
			replace({
				pathname: '/login',
				state: { nextPathname: nextState.location.pathname }
			})
			callback()
		}

		// if localstorage token exists, verify with redis that it's not expired
		else if(sessionToken) {
			axios.get(`/api/auth/verify/${sessionToken}`)
				.then(success => {
					if(success.status === 200) {
						callback()
					}
				}, fail => {
					console.log('failed auth', fail)
					replace({
						pathname: '/login',
						state: { nextPathname: nextState.location.pathname }
					})
					callback()
				})
				.catch(err => {
					//TODO: system log error
					console.log(err)
				})
		}
	}

	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App} onEnter={this.requireAuth}>
					<IndexRoute component={EmailContainer} />
					<Route path="/editor" component={EditorContainer}>
						<Route path="/editor/:id" component={EditorContainer}/>
					</Route>
					<Route path="/admin" component={AdminContainer}></Route>
					<Route path="/media" component={MediaContainer}></Route>
				</Route>
				<Route path="/login" component={LoginContainer} ></Route>
			</Router>
		)
	}
}

export default MailRoadRouter