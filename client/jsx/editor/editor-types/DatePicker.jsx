import React from 'react'
import { SingleDatePicker } from 'react-dates'
import moment from 'moment'

class DatePicker extends React.Component {
	constructor() {
		super()

		this.state = {
			date: null,
			focused: false
		}

		this.onDateChange = this.onDateChange.bind(this)
	}

	onDateChange(date) {
		this.setState({date})
		let formattedDate = date.toISOString()
		this.props.updateContentValue(formattedDate, this.props.index)
	}

	componentWillReceiveProps (nextProps) {
		let newDate = moment(nextProps.content)
		this.setState({date: newDate})
	}
	

	render() {
		return (
			<SingleDatePicker
				date={this.state.date}
				id={'single-date-picker' + this.index}
				focused={this.state.focused}
				onDateChange={this.onDateChange}
				onFocusChange={({focused}) => {this.setState({focused})}}
			/>
		)
	}


}

DatePicker.propTypes = {
	updateContentValue: React.PropTypes.func,
	index: React.PropTypes.number
}

export default DatePicker