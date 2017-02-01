import React from 'react'
import { Link } from 'react-router'
import autoBind from 'react-autobind'

export default class EmailTableRow extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			checked: this.props.checked || false
		}

		autoBind(this, 'formatDate', 'handleCheckboxChange')
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
			let splitDate = date.split('T');
			let time = splitDate[1].substring(0, splitDate[1].length - 4);
			return splitDate[0] + ' ' + time;
		}
		else return "bad date"
	}

	render() {
		return (
			<tr className="email-table__row">
				<td className="email-table__row__select">
					<input
						type="checkbox"
						id={"checkbox-" + this.props.rowValues.id}
						value={this.props.rowValues.id}
						onChange={this.handleCheckboxChange}
						checked={this.state.checked}
					/>
				</td>
				<td className="email-table__row__title"><Link to={`/editor/${this.props.rowValues.id}`}>{this.props.rowValues.title}</Link></td>
				<td className="email-table__row__template">{this.props.rowValues.template}</td>
				<td className="email-table__row__created-date">{this.formatDate(this.props.rowValues.createdAt)}</td>
				<td className="email-table__row__updated-date">{this.formatDate(this.props.rowValues.updatedAt)}</td>
			</tr>
		)
	}
}