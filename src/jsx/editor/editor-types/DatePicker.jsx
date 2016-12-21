import React from 'react'
import { SingleDatePicker } from 'react-dates'

import 'react-dates/lib/css/_datepicker.css'

export default class DatePicker extends React.Component {
	constructor() {
		super()

		this.state = {
			date: null,
			focused: false
		}
	}

	render() {
		return (
			<SingleDatePicker 
				id="SingleDatePicker"
				date={this.state.date}
				focused={this.state.focused}
				onDateChange={(date) => {this.setState({date})}}
				onFocusChange={({focused}) => {this.setState({focused})}}
			/>
		)
	}
}