import React from 'react'
import ReactDOM from 'react-dom'
import MainContainer from './jsx/MainContainer.jsx'
import EmailContainer from './jsx/emails/EmailContainer.jsx'
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'
import './sass/main.sass'

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={MainContainer}/>
		<Route path="/email" component={EmailContainer}/>
	</Router>,
		document.getElementById('emailbuilder-root')
);
