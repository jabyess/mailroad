import React from 'react'
import NavBar from './NavBar.jsx'

class App extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<div>
				<NavBar />
				{this.props.children}
			</div>
		)
	}
}
App.propTypes = {
	children: React.PropTypes.element
}

export default App