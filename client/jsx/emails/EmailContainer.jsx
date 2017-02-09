import React from 'react'
import NavBar from '../NavBar.jsx'
import autoBind from 'react-autobind'
import EmailTable from './EmailTable.jsx'
import EmailControls from './EmailControls.jsx'
import axios from 'axios'
import PouchDB from '../../lib/pouchdb.js'

export default class EmailContainer extends React.Component {
	constructor() {
		super()

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
				let values = results.data.rows.map((val) => {
					let newValues = {
						id: val.id,
						createdAt: val.value.createdAt,
						updatedAt: val.value.updatedAt,
						title: val.value.title,
						template: val.value.template
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
		
		this.setState((state) => {
			return state.selectedCheckboxes = {}
		}, this.listEmails)
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

	triggerSearch(searchText) {
		console.log(searchText)
		axios.post('/api/email/search', {
			searchText
		})
		.then((results) => {
			console.log(results)
		})
		.catch((err) => {
			console.log('error searching:',err)
		})

	}

	componentDidMount() {
		this.pouchDB.syncEverything((syncComplete) => {
			if(syncComplete) {
				this.listEmails()
			}
		})

	}

	render() {
		return (
			<container className="emailContainer">
				<NavBar/>
				<EmailControls 
					selectedCheckboxes={this.state.selectedCheckboxes}
					refreshEmailList={this.refreshEmailList}
					triggerSearch={this.triggerSearch}
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
