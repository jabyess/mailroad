import React from 'react'
import EmailTable from './EmailTable.jsx'
import NavBar from '../NavBar.jsx'

export default class EmailContainer extends React.Component {
	constructor() {
		super();
		this.state = {
			emailItems: []
		}
	}

	componentDidMount() {
		fetch('/api/listEmails')
			.then((response) => {
				return response.json()
			})
			.then((json) => {
				this.setState({emailItems: json})
			})
			.catch((ex)=>{
				console.log('exception', ex)
			})
	} 

	render() {
		return (
			<container className="emailContainer">
				<NavBar/>
				<EmailTable emailItems={this.state.emailItems}/>
			</container>
		)
	}
}
