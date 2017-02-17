
import React from 'react'

export default class LoginForm extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<div className="login-form box">
				<form className="login-form__form" action="/api/login/" method="post">
					<label htmlFor="username">Username</label>
					<input className="input is-large" id="username" type="text"/>
					<label htmlFor="password">Password</label>
					<input className="input is-large" id="password" type="password"/>
					<button type="submit" className="button">Login</button>
				</form>
			</div>
		)

	}
}