import React from 'react'
import EmailTable from './EmailTable.jsx'
import NavBar from '../NavBar.jsx'

class EmailContainer extends React.Component {
	constructor() {
		super();
		this.emailItems = [];
	}

	componentDidMount() {
		fetch('/api/listEmails')
			.then((response) => {
				return response.json()
			})
			.then((json) => {
				this.setState(this.emailItems = json);
			})
			.catch((ex)=>{
				console.log('exception', ex)
			})
	} 

	render() {
		return (
			<container className="emailContainer">
				<NavBar/>
				<EmailTable emailItems={this.emailItems}/>
			</container>
		)
	}
}

export default EmailContainer