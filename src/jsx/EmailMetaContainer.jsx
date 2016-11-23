import React from 'react'
import autoBind from 'react-autobind'

export default class EmailMetaContainer extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this, 'handleChildTitleChange')
	}

	handleChildTitleChange(event) {
		if(this.props.handleParentTitleChange) {
			this.props.handleParentTitleChange(event.target.value)
		}
		// this.setState({value: event.target.value})
	}

	componentDidMount() {
		console.log('metacontainer props', this.props)
		// this.setState({value: this.props.title})
	}

	render() {
		return (
			<div className="email-meta--container">
				<input className="email-meta--title"
					type="text"
					value={this.props.title}
					onChange={this.handleChildTitleChange}
				/>
				<div className="email-meta--id">{this.props.emailID}</div>
				<div className="email-meta--created-at">{this.props.createdAt}</div>
				<div className="email-meta--updated-at">{this.props.updatedAt}</div>
			</div> 
		)
	}

}