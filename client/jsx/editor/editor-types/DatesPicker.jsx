import React from 'react'
import { DateRangePicker } from 'react-dates'
// import { START_DATE, END_DATE } from 'react-dates/constants'
import moment from 'moment'

class DatesPicker extends React.Component {
	constructor() {
		super()

		this.onDatesChange = this.onDatesChange.bind(this)
		this.onFocusChange = this.onFocusChange.bind(this)

		this.state = {
			startDate: null,
			endDate: null,
			focusedInput: null
		}
	}

	onDatesChange({ startDate, endDate }) {
		this.setState({ startDate, endDate })
		
		let dates = this.convertDatesToString(startDate, endDate)
		this.props.updateContentValue(dates, this.props.index)
	}

	convertDatesToString(startDate, endDate) {
		let newStart = startDate ? startDate.toISOString() : this.props.startDate.toISOString()
		let newEnd = endDate ? endDate.toISOString() : this.props.endDate.toISOString()
		let content = { startDate: newStart, endDate: newEnd }
		return content
	}

	convertDatesToMoment(startDate, endDate) {
		let newStart = startDate ? moment(startDate) : this.props.startDate
		let newEnd = endDate ? moment(endDate) : this.props.endDate
		return { startDate: newStart, endDate: newEnd }
	}

	onFocusChange(focusedInput) {
		this.setState({ focusedInput })
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps)
		let dates = this.convertDatesToMoment(nextProps.content.startDate, nextProps.content.endDate)
		this.setState({startDate: dates.startDate, endDate: dates.endDate})
	}
	

	render() {
		return (
			<div className="date-range-picker">
				<div className="component-title">
					<label>DatesPicker Title</label>
					<input type="text" value={this.props.componentTitle} onChange={this.onTitleChange} />
				</div>
				<DateRangePicker
					startDate={this.state.startDate}
					endDate={this.state.endDate}
					id={'date-range-picker' + this.index}
					focusedInput={this.state.focusedInput}
					onDatesChange={this.onDatesChange}
					onFocusChange={this.onFocusChange}
				/>
			</div>
		)
	}
}

DatesPicker.propTypes = {
	updateContentValue: React.PropTypes.func,
	componentTitle: React.PropTypes.string,
	index: React.PropTypes.number,
	startDate: React.PropTypes.string,
	endDate: React.PropTypes.string
}

export default DatesPicker