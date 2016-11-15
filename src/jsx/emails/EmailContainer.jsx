import React from 'react';
import EmailTable from './EmailTable.jsx';

class EmailContainer extends React.Component {
	constructor() {
		super();
		this.emailItems = [];
	}

	componentDidMount() {
		console.log('emailcontainer mounted');
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
				<EmailTable emailItems={this.emailItems}/>				
			</container>
		)
	}
}

export default EmailContainer