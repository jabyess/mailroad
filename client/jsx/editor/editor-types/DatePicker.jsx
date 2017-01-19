import React from 'react'
import { SingleDatePicker } from 'react-dates'

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
				date={this.state.date}
				focused={this.state.focused}
				onDateChange={(date) => {this.setState({date})}}
				onFocusChange={({focused}) => {this.setState({focused})}}
			/>
		)
	}
}