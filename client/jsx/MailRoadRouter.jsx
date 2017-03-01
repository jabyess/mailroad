import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App.jsx'
import EditorContainer from './editor/EditorContainer.jsx'
import EmailContainer from './emails/EmailContainer.jsx'
import AdminContainer from './AdminContainer.jsx'
import MediaContainer from './media/MediaContainer.jsx'
import LoginContainer from './login/LoginContainer.jsx'
import autoBind from 'react-autobind'


class MailRoadRouter extends React.Component {
	constructor() {
		super()

// b6749cddd436d59c1c875ed8

		autoBind(this,
			'requireAuth',
			'loggedIn',
			'setLoggedInState'
		)

		this.state = {
			loggedIn: false
		}
	}

	loggedIn() {
		console.log('loggedIn:', !!this.state.loggedIn)
		return !!this.state.loggedIn
	}

	setLoggedInState(loggedIn) {
		this.setState({ loggedIn })
	}

	requireAuth(nextState, replace) {
		console.log(nextState)
		if(!this.loggedIn()) {
			replace({
				pathname: '/login',
				state: { nextPathname: nextState.location.pathname }
			})
		}
	}

	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App} onEnter={this.requireAuth} loggedIn={this.state.loggedIn}>
					<IndexRoute component={EmailContainer} />
					<Route path="/editor" component={EditorContainer} onEnter={this.requireAuth} loggedIn={this.state.loggedIn}>
						<Route path="/editor/:id" component={EditorContainer}/>
					</Route>
					<Route path="/admin" component={AdminContainer} onEnter={this.requireAuth} loggedIn={this.state.loggedIn}></Route>
					<Route path="/media" component={MediaContainer} onEnter={this.requireAuth} loggedIn={this.state.loggedIn}></Route>
				</Route>
				<Route path="/login" component={LoginContainer} loggedIn={this.state.loggedIn} setLoggedInState={this.setLoggedInState}></Route>
			</Router>
		)
	}
}

export default MailRoadRouter