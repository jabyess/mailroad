import React from 'react'
import autoBind from 'react-autobind'
import shortid from 'shortid'

const NOTIFICATION_TIMEOUTS = {
	success: 3000,
	danger: 30000,
	warning: 5000
}

class NotificationContainer extends React.Component {
	constructor() {
		super()

		autoBind(this,
			'pushNewNotification',
			'deleteNotification'
		)

		this.state = {
			notificationStack: []
		}
	}

	pushNewNotification(e) {
		const { type, text } = e.detail
		const timeout = NOTIFICATION_TIMEOUTS[type]
		const id = shortid.generate()

		this.setState((state) => {
			state.notificationStack.push({type, text, id})
		}, () => {
			window.setTimeout(() => {
				this.setState((state) => {
					state.notificationStack.forEach((note, i, arr) => {
						if(note.id === id) {
							arr.splice(i, 1)
						}
					})
				})
			}, timeout)
		})
	}

	componentDidMount () {
		window.addEventListener('MRNotification', this.pushNewNotification)
	}

	componentWillUnmount () {
		window.removeEventListener('MRNotification', this.pushNewNotification)
	}

	deleteNotification(e) {
		e.preventDefault()
		const index = e.target.dataset.index
		this.setState((state) => {
			state.notificationStack.splice(index, 1)
		})
	}


	render() {
		return(
			<div className="notificationContainer">
				{this.state.notificationStack.map((note, index) => {
					const classes = `notification notificationContainer__item is-${note.type}`
					return (
						<div className={classes} key={index}>
							<button className="delete" data-index={index} onClick={this.deleteNotification}></button>
							{note.text}
						</div>
					)
				})}
				
			</div>

		)
	}
}

NotificationContainer.propTypes = {

}

export default NotificationContainer