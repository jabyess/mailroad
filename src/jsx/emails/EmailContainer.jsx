import React from 'react'
import EmailTable from './EmailTable.jsx'
import NavBar from '../NavBar.jsx'
import autoBind from 'react-autobind'
import EmailControls from './EmailControls.jsx'
export default class EmailContainer extends React.Component {
	constructor() {
		super();

		autoBind(this, 'listEmails')
		
		this.state = {
			emailItems: []
		}
	}

	listEmails() {
		fetch('/api/listEmails')
			.then((response) => {
				return response.json()
			})
			.then((json) => {
				this.setState({emailItems: json})
			})
			.catch((ex) => {
				console.log('listEmails exception: ', ex)
			})
	}

	componentDidMount() {
		this.listEmails()
	} 
	// componentDidUpdate (prevProps, prevState) {
	// 	this.listEmails()
	// }
	

	render() {
		return (
			<container className="emailContainer">
				<NavBar/>
				<EmailControls/>
				<EmailTable emailItems={this.state.emailItems}/>
			</container>
		)
	}
}
