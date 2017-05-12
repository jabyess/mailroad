import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App.jsx'
import EditorContainer from './editor/EditorContainer.jsx'
import EmailContainer from './emails/EmailContainer.jsx'
import AdminContainer from './admin/AdminContainer.jsx'
import MediaContainer from './media/MediaContainer.jsx'
import LoginContainer from './login/LoginContainer.jsx'

class MailRoadRouter extends React.Component {
	constructor() {
		super()

	}


	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App} >
					<IndexRoute component={EmailContainer} />
					<Route path="/editor" component={EditorContainer}>
						<Route path="/editor/:id" component={EditorContainer}/>
					</Route>
					<Route path="/admin" component={AdminContainer}></Route>
					<Route path="/media" component={MediaContainer}></Route>
				</Route>
				<Route path="/login" component={LoginContainer}></Route>
			</Router>
		)
	}
}

export default MailRoadRouter