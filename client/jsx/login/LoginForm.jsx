import React from 'react'
import axios from 'axios'

export default class LoginForm extends React.Component {
	constructor() {
		super()

		this.state = {
			username: '',
			password: ''
		}

		this.onPasswordChange = this.onPasswordChange.bind(this)
		this.onUserChange = this.onUserChange.bind(this)
		this.submitLogin = this.submitLogin.bind(this)
	}

	onUserChange(e) {
		this.setState({username: e.target.value})

	}

	onPasswordChange(e) {
		this.setState({password: e.target.value})
	}

	submitLogin(e) {
		const formData = new FormData()
		formData.append('username', this.state.username)
		formData.append('password', this.state.password)
		console.log(formData)
		axios.post('/api/auth/login', {
			username: this.state.username, 
			password: this.state.password
		}).then(success => {
			console.log('success', success)
		}, fail => {
			console.log('fail', fail)
		}).catch(err => {
			console.log('err', err)
		})
	}

	render() {
		return (
			<div className="login-form box">
				<form className="login-form__form">
					<label htmlFor="username">Username</label>
					<input className="input is-large" id="username" onChange={this.onUserChange} type="text" value={this.state.username}/>
					<label htmlFor="password">Password</label>
					<input className="input is-large" id="password" onChange={this.onPasswordChange} type="password" value={this.state.password}/>
					<input type="submit" className="input" onClick={this.submitLogin}/>
				</form>
			</div>
		)

	}
}