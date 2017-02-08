import React from 'react'
import EmailTableRow from './EmailTableRow.jsx'

export default class EmailTable extends React.Component {
	
	render() {
		return (
			<table className="email-table">
				<thead>
					<tr>
						<th>Select</th>
						<th>Title</th>
						<th>Template</th>
						<th>Created Date</th>
						<th>Last Updated Date</th>
					</tr>
				</thead>
				<tbody>
					{this.props.emailItems.map((cv, i) => {
						return (
							<EmailTableRow rowValues={cv} key={i} checked={this.props.selectedCheckboxes[cv.id]} updateSelectedCheckboxes={this.props.updateSelectedCheckboxes} />
						)
					})}
				</tbody>
			</table>
		)
	}
}
