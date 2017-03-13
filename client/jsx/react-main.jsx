import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import MailRoadRouter from './MailRoadRouter.jsx'
import '../sass/main.sass'


const render = (Component) => {
	<AppContainer>
		<Component />
	</AppContainer>,
	document.getElementById('emailbuilder-root')
}

ReactDOM.render(
	<AppContainer>
		<MailRoadRouter />
	</AppContainer>,
	document.getElementById('emailbuilder-root')
)

if(module.hot) {
	module.hot.accept('./MailRoadRouter.jsx', () => {
		console.log('accepted mrr')
		render(MailRoadRouter)
	})
}

