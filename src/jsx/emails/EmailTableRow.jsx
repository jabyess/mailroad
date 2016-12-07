import React from 'react'
import { Link } from 'react-router'
import autoBind from 'react-autobind'

export default class EmailTableRow extends React.Component {

	constructor(props) {
		super(props)

		autoBind(this, 'formatDate', 'handleCheckboxChange')
	}

	handleCheckboxChange(event) {
		if(this.props.updateSelected) {
			this.props.updateSelected(event.target.value)
		}
	}

	formatDate(date) {
		let splitDate = date.split('T');
		let time = splitDate[1].substring(0, splitDate[1].length - 5);
		return splitDate[0] + ' ' + time;
	}

	render() {
		return (
			<tr className="email-table__row">
				<td className="email-table__row__select">
					<input
						type="checkbox"
						id={"checkbox-" + this.props.rowValue.id}
						value={this.props.rowValue.id}
						onChange={this.handleCheckboxChange}
						checked={this.props.checked}
					/>
				</td>
				<td className="email-table__row__title"><Link to={"/editor/"+this.props.rowValue.id}>{this.props.rowValue.title}</Link></td>
				<td className="email-table__row__created-date">{this.formatDate(this.props.rowValue.createdAt)}</td>
				<td className="email-table__row__updated-date">{this.formatDate(this.props.rowValue.updatedAt)}</td>
			</tr>
		)
	}
}