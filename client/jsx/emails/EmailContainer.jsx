import React from 'react'
import autoBind from 'react-autobind'
import EmailTable from './EmailTable.jsx'
import EmailControls from './EmailControls.jsx'
import EmailPagination from './EmailPagination.jsx'
import axios from 'axios'
import PDB from '../../lib/pouchdb.js'


const EMAILS_PER_PAGE = 10

export default class EmailContainer extends React.Component {
	constructor() {
		super()

		autoBind(this, 
			'updateSelectedCheckboxes',
			'refreshEmailList',
			'displayEmails',
			'pageNext',
			'pagePrev'
		)

		this.pouchDB = new PDB()
		
		this.state = {
			emailItems: [],
			selectedCheckboxes: {},
			page: 1
		}
	}

	mapEmailResults(emails) {
		let values = emails.map((val) => {
			let newValues = {
				id: val.id,
				createdAt: val.value.createdAt,
				updatedAt: val.value.updatedAt,
				title: val.value.title,
				template: val.value.template,
				category: val.value.category
			}
			return newValues
		})
		return values
	}

	displayEmails(paginatedEmails, direction) {
		if(!paginatedEmails) {
			axios('/api/email/list')
				.then((results) => {
					let values = this.mapEmailResults(results.data.rows)
					this.setState({
						emailItems: values,
						totalRows: results.data.total_rows
					})
				})
				.catch((ex) => {
					console.log('listEmails exception: ', ex)
				})
		}
		else {
			let emailItems = this.mapEmailResults(paginatedEmails)
			const page = direction === 'next' ? this.state.page + 1 : this.state.page - 1
			this.setState({
				emailItems: emailItems,
				page: page
			})
		}
	}

	refreshEmailList() {
		this.setState(() => {
			return this.state.selectedCheckboxes = {}
		}, this.displayEmails)
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
				this.displayEmails()
			}
		})
	}

	pagePrev() {
		axios.get('/api/email/list/', {
			params: {
				skip: this.state.page * EMAILS_PER_PAGE
			}
		}).then((response) => {
			this.displayEmails(response.data.rows, 'prev')
		})
	}

	pageNext() {
		axios.get('/api/email/list/', {
			params: {
				skip: this.state.page * EMAILS_PER_PAGE
			}
		}).then((response) => {
			this.displayEmails(response.data.rows, 'next')
		})
	}

	render() {
		return (
			<container className="emailContainer">
				<EmailControls 
					selectedCheckboxes={this.state.selectedCheckboxes}
					refreshEmailList={this.refreshEmailList}
					triggerSearch={this.triggerSearch}
				/>
				<EmailPagination 
					emailItems={this.state.emailItems}
					pageNext={this.pageNext}
					pagePrev={this.pagePrev}
					totalRows={this.state.totalRows}
					emailsPerPage={EMAILS_PER_PAGE}
					page={this.state.page}
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
