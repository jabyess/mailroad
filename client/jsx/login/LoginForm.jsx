import React from 'react'
import axios from 'axios'
import { browserHistory } from 'react-router'

class LoginForm extends React.Component {
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
		e.preventDefault()
		const formData = new FormData()

		formData.append('username', this.state.username)
		formData.append('password', this.state.password)

		axios.post('/api/auth/login', {
			username: this.state.username,
			password: this.state.password,
		})
		.then(() => {
			//on success, and redirect
			browserHistory.replace('/')
			return false
		}, fail => {
			//popup toast message saying fail username/password
			console.log(fail)
			this.props.fireNotification('warning', 'Invalid credentials')
			return false
		})
		.catch(err => {
			console.log('err', err)
			
			return false
		})
		return false
	}

	render() {
		return (
			<div className="login-form box">
				<form className="login-form__form container">
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

LoginForm.propTypes = {
	fireNotification: React.PropTypes.func
}

export default LoginForm