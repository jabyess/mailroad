import React from 'react'

class EmailTable extends React.Component {
  constructor() {
    super()
		// this.state = {};
  }

	formatDate(date) {
		let splitDate = date.split('T');
		console.log(splitDate);
		let time = splitDate[1].substring(0, splitDate[1].length - 5);
		return splitDate[0] + ' ' + time;
	}
	componentDidMount() {
		console.log(this.props);
	}
	componentDidUpdate() {
		console.log(this.props);
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
								<td className="email-checkbox">
									<input type="checkbox"/>
								</td>
								<td className="email-title">{cv.title}</td>
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