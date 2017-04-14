import React from 'react'
import autoBind from 'react-autobind'

class EventsCalendar extends React.Component {
	constructor() {
		super()

		this.state = {
			events : [{date: '', name: ''}]
		}

		autoBind(this,
			'addEvent',
			'removeEvent',
			'onDateChange',
			'onEventChange',
			'onTitleChange'
		)
	}

	addEvent() {
		this.setState(() => { this.state.events.push({date: '', name: '' }) })
	}

	removeEvent() {
		this.setState(() => { this.state.events.pop() })
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.content) {
			this.setState({events: nextProps.content})
		}
	}
	
	onDateChange(e) {
		const date = e.target.value
		const dateIndex = e.target.dataset.index

		this.props.updateEventDate(date, this.props.index, dateIndex)
	}

	onEventChange(e) {
		const eventName = e.target.value
		const dateIndex = e.target.dataset.index
		
		this.props.updateEventTitle(eventName, this.props.index, dateIndex)
	}
	
	onTitleChange(e) {
		const componentTitle = e.target.value
		this.props.updateComponentTitle(componentTitle, this.props.index)
	}

	render() {
		return (
			<div className="eventsCalendar box">
				<div className="eventsCalendar__title">
					<h1 className="title">Events Calendar</h1>
				</div>
				<select name="componentTitle" className="select" onChange={this.onTitleChange} value={this.props.componentTitle}>
					{this.props.componentTitles.map((componentTitle, i) => {
						return (
							<option key={i} value={componentTitle.title}>{componentTitle.title}</option>
						)
					})}
				</select>
				<button onClick={this.addEvent} className="button eventsCalendar__button">Add Event</button>
				<button onClick={this.removeEvent} className="button eventsCalendar__button">Remove Event</button>
				{this.state.events.map((event, i) => {
					return (
						<div className="eventsCalendar__row" key={i}>
							<label htmlFor={'eventName-'+i}>Title</label>
							<input 
								name={'eventName-' + i}
								type="text"
								placeholder="Event Name"
								data-index={i}
								className="input eventsCalendar__date"
								onChange={this.onEventChange}
								value={event.name}
							/>
							<label htmlFor={'eventDate-'+i}>Date</label>
							<input
								type="text"
								placeholder="MM/DD/YYYY"
								name={'eventDate-' + i}
								className="input eventsCalendar__date"
								value={event.date}
								onChange={this.onDateChange}
								data-index={i}
							/>
						</div>
					)
				})}
			</div>
		)

	}
}

EventsCalendar.defaultProps = {
	content: [{date: '', name: ''}]

}

EventsCalendar.propTypes = {
	componentTitle: React.PropTypes.string,
	componentTitles: React.PropTypes.array,
	content: React.PropTypes.array,
	index: React.PropTypes.number,
	updateEventDate: React.PropTypes.func,
	updateEventTitle: React.PropTypes.func,
	updateComponentTitle: React.PropTypes.func,
}

export default EventsCalendar