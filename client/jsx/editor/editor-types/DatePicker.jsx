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
		this.onTitleChange = this.onTitleChange.bind(this)
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
	
	onTitleChange(event) {
		event.persist()
		let title = event.target.value
		if(this.props.updateComponentTitle) {
			this.props.updateComponentTitle(title, this.props.index)
		}
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.content) {
			let date = moment(nextProps.content)
			this.setState({ date })
		}
		else {
			this.setState({date: null})
		}
	}
	

	render() {
		return (
			<div className="date-picker box">
				<div className="component-title">
					<label>DatePicker Title</label>
					<select className="select" type="select" value={this.props.componentTitle} onChange={this.onTitleChange}>
						{this.props.componentTitles.map((title, i) => {
							return <option key={title + i} value={title}>{title}</option>
						})}
					</select>
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