import React from 'react'
import NavBar from '../NavBar.jsx'
import autoBind from 'react-autobind'
import EmailTable from './EmailTable.jsx'
import EmailControls from './EmailControls.jsx'
import EmailTableRow from './EmailTableRow.jsx'
import axios from 'axios'
import PouchDB from '../../lib/pouchdb.js'

export default class EmailContainer extends React.Component {
	constructor() {
		super();

		autoBind(this, 
			'listEmails', 
			'updateSelectedCheckboxes',
			'refreshEmailList'
		)

		this.pouchDB = new PouchDB('emailbuilder')
		
		this.state = {
			emailItems: [],
			selectedCheckboxes: {}
		}
	}

	listEmails() {
		axios('/api/email/list')
			.then((results) => {
				let values = results.data.rows.map((val, ind) => {
					let newValues = {
						id: val.id,
						createdAt: val.value.createdAt,
						updatedAt: val.value.updatedAt,
						title: val.value.title
					}
					return newValues
				})
			this.setState({ emailItems: values })
			})
			.catch((ex) => {
				console.log('listEmails exception: ', ex)
			})
	}

	refreshEmailList() {
		console.log('refreshing email list')
		this.listEmails()
		this.setState((state) => {
			return state.selectedCheckboxes = {}
		}, console.log('reset selectedCheckboxes'))
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
				<EmailControls 
					selectedCheckboxes={this.state.selectedCheckboxes}
					refreshEmailList={this.refreshEmailList}
				/>
				<EmailTable 
					emailItems={this.state.emailItems}
					selectedCheckboxes={this.state.selectedCheckboxes}
					updateSelectedCheckboxes={this.updateSelectedCheckboxes}
				/>
			</container>
		)
	}
}
