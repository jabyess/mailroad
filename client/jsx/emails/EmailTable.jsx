import React from 'react'
import autoBind from 'react-autobind'
import EmailTableRow from './EmailTableRow.jsx'

export default class EmailTable extends React.Component {
	constructor() {
		super()

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
							<EmailTableRow rowValue={cv} key={i} updateSelectedCheckboxes={this.props.updateSelectedCheckboxes}/>
						)
					})}
				</tbody>
			</table>
		)
	}
}
