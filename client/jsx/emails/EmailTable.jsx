import React from 'react'
import EmailTableRow from './EmailTableRow.jsx'

class EmailTable extends React.Component {
	
	render() {
		return (
			<table className="table email-table">
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

EmailTable.propTypes = {
	selectedCheckboxes: React.PropTypes.object,
	updateSelectedCheckboxes: React.PropTypes.func,
	emailItems: React.PropTypes.array
}

export default EmailTable