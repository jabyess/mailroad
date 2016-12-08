import React from 'react'
import EmailTable from './EmailTable.jsx'
import NavBar from '../NavBar.jsx'
import autoBind from 'react-autobind'
import EmailControls from './EmailControls.jsx'
import EmailTableRow from './EmailTableRow.jsx'

export default class EmailContainer extends React.Component {
	constructor() {
		super();

		autoBind(this, 
			'listEmails', 
			'updateSelectedCheckboxes',
			'refreshEmailList'
		)
		
		this.state = {
			emailItems: [],
			selectedCheckboxes: {}
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

	refreshEmailList() {
		this.listEmails()
		this.setState({ selectedCheckboxes: {} }) 
	}

	updateSelectedCheckboxes(value) {
		if(this.state.selectedCheckboxes.hasOwnProperty(value.toString())) {
			this.setState(() => {
				delete this.state.selectedCheckboxes[value]
			})
		}
		else {
			this.setState(() => {
				this.state.selectedCheckboxes[value] = true
			})
		}
	}

	componentDidMount() {
		this.listEmails()
	}

	render() {
		return (
			<container className="emailContainer">
				<NavBar/>
				<EmailControls selectedCheckboxes={this.state.selectedCheckboxes} refreshEmailList={this.refreshEmailList} />
				<table className="email-table">
					<thead>
						<tr>
							<th>Select</th>
							<th>Title</th>
							<th>Created Date</th>
							<th>Last Updated Date</th>
						</tr>
					</thead>
					<tbody>
						{this.state.emailItems.map((cv, i) => {
							return (
								<EmailTableRow
									checked={this.state.selectedCheckboxes[cv.id]}
									rowValue={cv}
									key={i}
									updateSelectedCheckboxes={this.updateSelectedCheckboxes}
								/>
							)
						})}
					</tbody>
				</table>
			</container>
		)
	}
}
