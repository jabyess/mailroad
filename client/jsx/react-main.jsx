import React from 'react'
import { render } from 'react-dom'
import MailRoadRouter from './MailRoadRouter.jsx'
import '../sass/main.sass'

render(
	<MailRoadRouter />,
	document.getElementById('emailbuilder-root')
)
