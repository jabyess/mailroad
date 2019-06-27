import React from "react"
import PropTypes from "prop-types"
import axios from "axios"
import { browserHistory } from "react-router"

class LoginForm extends React.Component {
	constructor() {
		super()

		this.state = {
			username: "",
			password: "",
			signupOrLogin: "Login"
		}

		this.onChange = this.onChange.bind(this)
		this.submitLogin = this.submitLogin.bind(this)
		this.toggleMode = this.toggleMode.bind(this)
		this.determineAction = this.determineAction.bind(this)
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value })
	}

	toggleMode(e) {
		e.preventDefault()
		const mode = this.state.signupOrLogin

		if (mode === "Login") {
			this.setState({ signupOrLogin: "Sign up" })
		} else if (mode === "Sign up") {
			this.setState({ signupOrLogin: "Login" })
		}
	}

	determineAction(e) {
		if (this.state.signupOrLogin === "Sign up") {
			this.submitSignup(e)
		} else {
			this.submitLogin(e)
		}
	}

	submitSignup(e) {
		e.preventDefault()

		axios.put("/api/auth/signup", {
			username: this.state.username,
			password: this.state.password
		})
	}

	submitLogin(e) {
		e.preventDefault()

		axios
			.post("/api/auth/login", {
				username: this.state.username,
				password: this.state.password
			})
			.then(
				() => {
					//on success, and redirect
					browserHistory.replace("/")
					return false
				},
				fail => {
					//popup toast message saying fail username/password
					console.log(fail)
					this.props.fireNotification("warning", "Invalid credentials")
					return false
				}
			)
			.catch(err => {
				console.log("err", err)

				return false
			})
		return false
	}

	render() {
		return (
			<div className="login-form box">
				<form className="login-form__form container">
					<label htmlFor="username">Username</label>
					<input
						className="input is-large"
						id="username"
						onChange={this.onChange}
						type="text"
						name="username"
						value={this.state.username}
					/>
					<label htmlFor="password">Password</label>
					<input
						className="input is-large"
						id="password"
						onChange={this.onChange}
						type="password"
						name="password"
						value={this.state.password}
					/>
					<button className="input" onClick={this.toggleMode}>
						click to toggle mode: {this.state.signupOrLogin}
					</button>
					<button className="input" onClick={this.determineAction}>
						Submit
					</button>
				</form>
			</div>
		)
	}
}

LoginForm.propTypes = {
	fireNotification: PropTypes.func
}

export default LoginForm
