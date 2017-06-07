import React from 'react'
import autoBind from 'react-autobind'
import EmailTable from './EmailTable'
import EmailControls from './EmailControls'
import EmailPagination from './EmailPagination'
import axiosClient from '../../lib/axios'

const EMAILS_PER_PAGE = 10

export default class EmailContainer extends React.Component {
	constructor() {
		super()

		autoBind(this, 
			'updateSelectedCheckboxes',
			'refreshEmailList',
			'displayEmails',
			'pageNext',
			'pagePrev',
			'skipToPage'
		)

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
				category: val.value.category,
				author: val.value.author
			}
			return newValues
		})
		return values
	}

	displayEmails(paginatedEmails, direction) {
		if(!paginatedEmails) {
			axiosClient('/api/email/list')
				.then((results) => {
					let values = this.mapEmailResults(results.data.rows)
					this.setState({
						emailItems: values,
						totalRows: results.data.total_rows
					})
				})
				.catch(ex => {
					console.log('listEmails exception: ', ex)
				})
		}
		else {
			let emailItems = this.mapEmailResults(paginatedEmails)
			const page = direction === 'next' ? this.state.page + 1 : this.state.page - 1
			this.setState({ emailItems, page })
		}
	}

	refreshEmailList(clearState) {
		if(clearState) {
			this.setState(() => {
				const keys = Object.keys(this.state.selectedCheckboxes)
				keys.forEach(k => delete this.state.selectedCheckboxes[k])
			}, this.displayEmails)
		}
		else {
			this.displayEmails()
		}
	}

	skipToPage(page) {
		axiosClient('/api/email/list', {
			params: {
				skip: (page - 1) * EMAILS_PER_PAGE
			}
		})
		.then((results) => {
			const emailItems = this.mapEmailResults(results.data.rows)
			this.setState({emailItems, page})
			// console.log(emailItems, page)
		})
		.catch((err) => {
			console.log('skipToPage exception: ', err)
		})
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
		axiosClient.post('/api/email/search', {
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
		this.displayEmails()
	}

	pagePrev() {
		// let skip = 0
		let skip = (this.state.page === 2) ? null : (this.state.page - 2) * EMAILS_PER_PAGE
		axiosClient.get('/api/email/list/', {
			params: {
				skip: skip
			}
		}).then((response) => {
			this.displayEmails(response.data.rows, 'prev')
		})
	}

	pageNext() {
		axiosClient.get('/api/email/list/', {
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
					skipToPage={this.skipToPage}
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
