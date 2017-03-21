import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

const DATE_STRING = 'YYYY-MM-DD HH:mm:ss'

class EmailTableRow extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			checked: false
		}

		this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
	}

	handleCheckboxChange(event) {
		if(this.props.updateSelectedCheckboxes) {
			this.props.updateSelectedCheckboxes(event.target.value)
		}
	}

	componentWillReceiveProps (nextProps) {
		if(this.state.checked !== nextProps.checked) {
			this.setState({checked: nextProps.checked})
		}
	}
	
	formatDate(date) {
		if(date) {
			return moment(date).format(DATE_STRING)
		}
		else return 'bad or missing date'
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
				<td className="email-table__row__template">{this.props.rowValues.template}</td>
				<td className="email-table__row__category">{this.props.rowValues.category}</td>
				<td className="email-table__row__created-date">{this.formatDate(this.props.rowValues.createdAt)}</td>
				<td className="email-table__row__updated-date">{this.formatDate(this.props.rowValues.updatedAt)}</td>
			</tr>
		)
	}
}

EmailTableRow.propTypes = {
	rowValues: React.PropTypes.object,
	updateSelectedCheckboxes: React.PropTypes.func,
	checked: React.PropTypes.bool
}
export default EmailTableRow