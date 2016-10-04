import React from 'react';

export default class NavBar extends React.Component {
	render() {
		return (
			<div className="navbar">
				<ul className="navbar-list">
					<li className="navbar-item"><a href="">Home</a></li>
					<li className="navbar-item"><a href="">Emails</a></li>
					<li className="navbar-item"><a href="">Etc</a></li>
				</ul>
			</div>
		);
	}

}
