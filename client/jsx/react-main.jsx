import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import MailRoadRouter from './MailRoadRouter.jsx'
import '../sass/main.sass'

ReactDOM.render(
	<AppContainer>
		<MailRoadRouter />
	</AppContainer>,
	document.getElementById('emailbuilder-root')
)
