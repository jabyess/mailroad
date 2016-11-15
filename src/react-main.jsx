import React from 'react'
import ReactDOM from 'react-dom'
import MainContainer from './jsx/MainContainer.jsx'
import EmailContainer from './jsx/emails/EmailContainer.jsx'
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'
import './sass/main.sass'

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={EmailContainer}>
			<Route path="/editor" component={MainContainer}/>
		</Route>
	</Router>,
		document.getElementById('emailbuilder-root')
);
