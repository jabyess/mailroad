import React from 'react'
import { Link } from 'react-router'
import autoBind from 'react-autobind'

export default class EmailTable extends React.Component {
	constructor() {
		super()

		autoBind(this, 'handleCheckboxChange')

	}
	formatDate(date) {
		let splitDate = date.split('T');
		let time = splitDate[1].substring(0, splitDate[1].length - 5);
		return splitDate[0] + ' ' + time;
	}

	refreshEmails() {
		fetch('/api/listEmails')
		.then((response) => {
			return response.json()
		})
		.then((json) => {

		}) 
	}

	handleCheckboxChange(event) {
		if(this.props.updateSelected) {
			this.props.updateSelected(event.target.value)
		}
	}
	
	render() {
		return (
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
					{this.props.emailItems.map((cv, i) => {
						return (
							<tr className="email-table__row" key={i} >
								<td className="email-table__row__select">
									<input type="checkbox" value={cv.id} onChange={this.handleCheckboxChange}/>
								</td>
								<td className="email-table__row__title"><Link to={"/editor/"+cv.id}>{cv.title}</Link></td>
								<td className="email-table__row__created-date">{this.formatDate(cv.createdAt)}</td>
								<td className="email-table__row__updated-date">{this.formatDate(cv.updatedAt)}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		)
	}
}
