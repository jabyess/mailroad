import React from 'react'
import { Link } from 'react-router'

class EmailTable extends React.Component {
	formatDate(date) {
		let splitDate = date.split('T');
		let time = splitDate[1].substring(0, splitDate[1].length - 5);
		return splitDate[0] + ' ' + time;
	}

	deleteEmail(id) {
		console.log('deleting: ', id)
		fetch(`/api/deleteEmail/${id}`, {
			method: 'DELETE'
		})
		.then((response) => {
			return response
		})
		.then((response) => {
			console.log(response)
		})
	}
	
	render() {
		return (
			<table className="email-table-container">
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
							<tr className="email-table-row" key={i}>
								<td className="email-delete" onClick={()=> { this.deleteEmail(cv.id) }}><span>-</span></td>
								<td className="email-title"><Link to={"/editor/"+cv.id}>{cv.title}</Link></td>
								<td className="email-created-date">{this.formatDate(cv.createdAt)}</td>
								<td className="email-updated-date">{this.formatDate(cv.updatedAt)}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		)
	}
}
export default EmailTable