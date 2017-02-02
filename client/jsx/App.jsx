import React from 'react'

export default class App extends React.Component {
	constructor() {
		super()
	}

	render() {
		return this.props.children
	}
}