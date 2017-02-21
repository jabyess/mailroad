import React from 'react'
import NavBar from './NavBar.jsx'

class App extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<div>
				<div className="app-nav columns">
					<div className="column">
						<NavBar />
					</div>
				</div>
				<div className="app-content columns">
					<div className="column is-12">
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}
App.propTypes = {
	children: React.PropTypes.element
}

export default App