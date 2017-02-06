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
		if(date) {
			let formattedDate = date.toISOString()
			this.props.updateContentValue(formattedDate, this.props.index)
		}
		else {
			this.props.updateContentValue(date, this.props.index)
		}
	}

	componentWillReceiveProps (nextProps) {
		let newDate = moment(nextProps.content)
		if(nextProps.content) {
			this.setState({date: newDate})
		}
		else {
			this.setState({date: null})
		}
	}
	

	render() {
		return (
			<div className="date-picker">
				<div className="component-title">
					<label>DatesPicker Title</label>
					<input type="text" value={this.props.componentTitle} onChange={this.onTitleChange} />
				</div>
				<SingleDatePicker
					date={this.state.date}
					id={'single-date-picker' + this.index}
					focused={this.state.focused}
					onDateChange={this.onDateChange}
					onFocusChange={({focused}) => {this.setState({focused})}}
					numberOfMonths={1}
					showClearDate={true}
				/>
			</div>
		)
	}


}

DatePicker.propTypes = {
	updateContentValue: React.PropTypes.func,
	index: React.PropTypes.number,
	componentTitle: React.PropTypes.string
}

export default DatePicker