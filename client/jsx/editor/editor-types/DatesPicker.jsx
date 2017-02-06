import React from 'react'
import { DateRangePicker } from 'react-dates'
import autoBind from 'react-autobind'
import moment from 'moment'

class DatesPicker extends React.Component {
	constructor() {
		super()

		autoBind(this,
		'onDatesChange',
		'onFocusChange',
		'onTitleChange'
		)

		this.state = {
			startDate: null,
			endDate: null,
			focusedInput: null,
		}
	}

	onDatesChange({ startDate, endDate }) {
		this.setState({ startDate, endDate })

		console.log(startDate, endDate)

		let dates = this.convertDatesToString(startDate, endDate)
		this.props.updateContentValue(dates, this.props.index)
	}

	convertDatesToString(startDate, endDate) {
		let newStart = startDate ? startDate.toISOString() : null
		let newEnd = endDate ? endDate.toISOString() : null
		let content = { startDate: newStart, endDate: newEnd }
		return content
	}

	convertDatesToMoment(startDate, endDate) {
		let newStart = startDate ? moment(startDate) : this.props.startDate
		let newEnd = endDate ? moment(endDate) : this.props.endDate
		return { startDate: newStart, endDate: newEnd }
	}

	onTitleChange(event) {
		event.persist()
		let title = event.target.value
		this.setState({ title })
		if(this.props.updateComponentTitle) {
			this.props.updateComponentTitle(title, this.props.index)
		}
	}

	onFocusChange(focusedInput) {
		this.setState({ focusedInput })
	}

	componentWillReceiveProps(nextProps) {
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
					showClearDates={true}
					onFocusChange={this.onFocusChange}
				/>
			</div>
		)
	}
}

DatesPicker.propTypes = {
	updateContentValue: React.PropTypes.func,
	updateComponentTitle: React.PropTypes.func,
	componentTitle: React.PropTypes.string,
	index: React.PropTypes.number,
	startDate: React.PropTypes.string,
	endDate: React.PropTypes.string
}

export default DatesPicker