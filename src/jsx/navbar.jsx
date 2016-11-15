import React from 'react'
import { Link } from 'react-router'

export default class NavBar extends React.Component {
	render() {
		return (
			<div className="navbar">
				<ul>
					<li><Link activeClassName="active" to="/">Home</Link></li>
					<li><Link activeClassName="active" to="/editor">Email</Link></li>
				</ul>
			</div>
		);
	}

}
