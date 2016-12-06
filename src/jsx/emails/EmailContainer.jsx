import React from 'react'
import EmailTable from './EmailTable.jsx'
import NavBar from '../NavBar.jsx'
import autoBind from 'react-autobind'
import EmailControls from './EmailControls.jsx'
export default class EmailContainer extends React.Component {
	constructor() {
		super();

		autoBind(this, 'listEmails', 'updateSelected')
		
		this.state = {
			emailItems: [],
			selectedEmails: []
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

	updateSelected(selected) {
		this.setState(() => {
			const index = this.state.selectedEmails.indexOf(selected)
			if(index >= 0) {
				return this.state.selectedEmails.splice(index, 1)
			}
			else {
				return this.state.selectedEmails.push(selected)
			}
		})
	}

	refreshEmails() {
		
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
				<EmailControls selectedEmails={this.state.selectedEmails} refreshEmails={this.refreshEmails}/>
				<EmailTable emailItems={this.state.emailItems} updateSelected={this.updateSelected}/>
			</container>
		)
	}
}
