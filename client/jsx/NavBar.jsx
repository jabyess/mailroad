import React from 'react'
import { Link, IndexLink } from 'react-router'

export default class NavBar extends React.Component {
	render() {
		return (
			<div className="nav navbar has-shadow">
				<div className="nav-left navbar__section">
					<IndexLink className="nav-item is-tab"  activeClassName="is-active" to="/">Home</IndexLink>
					<Link className="nav-item is-tab"  activeClassName="is-active" to="/editor">Create Email</Link>
					<Link className="nav-item is-tab"  activeClassName="is-active" to="/admin">Admin</Link>
					<Link className="nav-item is-tab"  activeClassName="is-active" to="/media">Media</Link>
				</div>
			</div>
		)
	}

}
