import React from "react"
import LoginForm from "./LoginForm"
import NotificationContainer from "../NotificationContainer.jsx"

class LoginContainer extends React.Component {
	constructor() {
		super()

		this.fireNotification = this.fireNotification.bind(this)
	}

	fireNotification(type, text) {
		const loginNotification = new CustomEvent("MRNotification", {
			detail: {
				type,
				text
			}
		})
		window.dispatchEvent(loginNotification)
	}

	render() {
		return (
			<div className="columns">
				<div className="column is-8 is-offset-2">
					<NotificationContainer />
					<h1>Log yourself in</h1>
					<LoginForm fireNotification={this.fireNotification} />
				</div>
			</div>
		)
	}
}

export default LoginContainer
