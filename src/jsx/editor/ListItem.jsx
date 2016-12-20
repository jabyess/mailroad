import React from 'react'

export default class ListItem extends React.Component {
	constructor() {
		super()
		this.displayName = 'ListItem'
	}
	render() {
		return (
			<div {...this.props} className="list-item">{this.props.children}</div>
		)
	}
}