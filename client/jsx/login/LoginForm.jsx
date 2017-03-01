import React from 'react'
import axios from 'axios'
import { browserHistory } from 'react-router'
import shortid from 'shortid'

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

// b6749cddd436d59c1c875ed8

	submitLogin(e) {
		e.preventDefault()
		const sessionToken = shortid.generate()
		console.log(sessionToken)
		const formData = new FormData()
		formData.append('username', this.state.username)
		formData.append('password', this.state.password)
		axios.post('/api/auth/login', {
			username: this.state.username,
			password: this.state.password,
			sessionToken: sessionToken
		}).then(success => {
			console.log('success', success)
			const redirectRoute = success.data.route
			this.props.setLoggedInState(true)
			browserHistory.push(redirectRoute)
			return false
		}, fail => {
			console.log('fail', fail)
			return false
		}).catch(err => {
			console.log('err', err)
			return false
		})
		return false
	}

	testRedirect(e) {
		e.preventDefault()
		axios.post('/api/auth/redirect', {
			key: 'wat'
		}).then((wat) => {
			console.log(wat)
			console.log(wat.status)
			console.log(wat.data)
			return false
		})
		return false
	}

// <button className="button" onClick={this.testRedirect}>Redirect</button>
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
				<button className="button" onClick={this.testRedirect}>Redirect</button>
			</div>
		)
	}
}