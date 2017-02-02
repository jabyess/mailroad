import React from 'react'
import ReactDOM from 'react-dom'
import EditorContainer from './editor/EditorContainer.jsx'
import EmailContainer from './emails/EmailContainer.jsx'
import AdminContainer from './AdminContainer.jsx'
import MediaContainer from './media/MediaContainer.jsx'
import App from './App.jsx'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import '../sass/main.sass'

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={EmailContainer} />
			<Route path="/editor" component={EditorContainer}>
				<Route path="/editor/:id" component={EditorContainer}/>
			</Route>
			<Route path="/admin" component={AdminContainer}></Route>
			<Route path="/media" component={MediaContainer}></Route>
		</Route>
	</Router>,
		document.getElementById('emailbuilder-root')
);
