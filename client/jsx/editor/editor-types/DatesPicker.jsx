import React from 'react'
import { DateRangePicker } from 'react-dates'
import { START_DATE, END_DATE } from 'react-dates/constants'

export default class DatesPicker extends React.Component {
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
    this.setState({ startDate, endDate });
  }

	onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

	render() {
		return (
			<DateRangePicker
				startDate={this.state.startDate}
				endDate={this.state.endDate}
				focusedInput={this.state.focusedInput}
				onDatesChange={this.onDatesChange}
				onFocusChange={this.onFocusChange}
			/>
		)
	}
}