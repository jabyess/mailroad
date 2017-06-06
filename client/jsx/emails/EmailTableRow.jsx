import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { formatTimestamp } from '../../lib/utils'

class EmailTableRow extends React.Component {

	constructor(props) {
		super(props)

		this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
	}

	handleCheckboxChange(event) {
		if(this.props.updateSelectedCheckboxes) {
			this.props.updateSelectedCheckboxes(event.target.value)
		}
	}

	render() {
		return (
			<tr className="email-table__row">
				<td className="email-table__row__select">
					<input
						className="checkbox"
						type="checkbox"
						id={'checkbox-' + this.props.rowValues.id}
						value={this.props.rowValues.id}
						onChange={this.handleCheckboxChange}
					/>
				</td>
				<td className="email-table__row__title"><Link to={`/editor/${this.props.rowValues.id}`}>{this.props.rowValues.title}</Link></td>
				<td className="email-table__row__author">{this.props.rowValues.author}</td>
				<td className="email-table__row__template">{this.props.rowValues.template}</td>
				<td className="email-table__row__category">{this.props.rowValues.category}</td>
				<td className="email-table__row__created-date">{formatTimestamp(this.props.rowValues.createdAt)}</td>
				<td className="email-table__row__updated-date">{formatTimestamp(this.props.rowValues.updatedAt)}</td>
			</tr>
		)
	}
}

EmailTableRow.propTypes = {
	rowValues: PropTypes.object,
	updateSelectedCheckboxes: PropTypes.func,
	checked: PropTypes.bool
}
export default EmailTableRow