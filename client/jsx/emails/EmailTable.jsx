import React from 'react'
import PropTypes from 'prop-types'
import EmailTableRow from './EmailTableRow.jsx'

class EmailTable extends React.Component {
	
	render() {
		return (
			<table className="table is-striped email-table">
				<thead className="email-table__header">
					<tr>
						<th>Select</th>
						<th>Title</th>
						<th>Author</th>
						<th>Template</th>
						<th>Category</th>
						<th>Created</th>
						<th>Updated</th>
					</tr>
				</thead>
				<tbody>
					{this.props.emailItems.map((cv) => {
						return (
							<EmailTableRow 
								rowValues={cv}
								key={cv.id}
								checked={this.props.selectedCheckboxes[cv.id]}
								updateSelectedCheckboxes={this.props.updateSelectedCheckboxes}
							/>
						)
					})}
				</tbody>
			</table>
		)
	}
}

EmailTable.propTypes = {
	selectedCheckboxes: PropTypes.object,
	updateSelectedCheckboxes: PropTypes.func,
	emailItems: PropTypes.array
}

export default EmailTable