import React from 'react'
import { Link, IndexLink } from 'react-router'

export default class NavBar extends React.Component {
	render() {
		return (
			<div className="navbar">
				<div className="navbar__section">
					<div className="navbar__item"><IndexLink activeClassName="active" to="/">Home</IndexLink></div>
					<div className="navbar__item"><Link activeClassName="active" to="/editor">Create Email</Link></div>
					<div className="navbar__item"><Link activeClassName="active" to="/admin">Admin</Link></div>
					<div className="navbar__item"><Link activeClassName="active" to="/media">Media</Link></div>
				</div>
			</div>
		);
	}

}
