import React from 'react'

class SaveButton extends React.Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		if(this.props.saveToDB) {
			this.props.saveToDB()
		}
	}

	render() {
		return (
			<button onClick={this.handleClick}>Save</button>
		)
	}
}

export default SaveButton