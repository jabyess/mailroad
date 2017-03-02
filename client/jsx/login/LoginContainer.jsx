import React from 'react'
import LoginForm from './LoginForm.jsx'

export default class LoginContainer extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<div className="columns">
				<div className="column is-8 is-offset-2">
					<h1>Log yourself in</h1>
					<LoginForm />
				</div>
			</div>
		)
	}
}