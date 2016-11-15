import React from 'react'
import { Link } from 'react-router'

export default class NavBar extends React.Component {
	render() {
		return (
			<div>
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/email">Email</Link></li>
				</ul>
			</div>
		);
	}

}
