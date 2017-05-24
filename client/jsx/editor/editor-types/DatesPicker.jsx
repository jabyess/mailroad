import React from 'react'
import PropTypes from 'prop-types'
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
		
		if(this.props.updateComponentTitle) {
			this.props.updateComponentTitle(title, this.props.index)
		}
	}

	onFocusChange(focusedInput) {
		this.setState({ focusedInput })
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.content) {
			let dates = this.convertDatesToMoment(nextProps.content.startDate, nextProps.content.endDate)
			this.setState({startDate: dates.startDate, endDate: dates.endDate})
		}
	}

	render() {
		return (
			<div className="date-range-picker">
				<div className="component-title">
					<label>DatesPicker Title</label>
					<select className="select" type="select" value={this.props.componentTitle} onChange={this.onTitleChange}>
						{this.props.componentTitles.map((title, i) => {
							return <option key={i} value={title.title}>{title.title}</option>
						})}
					</select>
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
	updateContentValue: PropTypes.func,
	updateComponentTitle: PropTypes.func,
	componentTitle: PropTypes.string,
	componentTitles: PropTypes.array,
	index: PropTypes.number,
	startDate: PropTypes.string,
	endDate: PropTypes.string
}

export default DatesPicker