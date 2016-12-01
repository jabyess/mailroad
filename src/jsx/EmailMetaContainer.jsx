import React from 'react'
import autoBind from 'react-autobind'

export default class EmailMetaContainer extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this, 'handleChildTitleChange', 'handleChildTemplateChange')
	}

	handleChildTitleChange(event) {
		if(this.props.handleParentTitleChange) {
			this.props.handleParentTitleChange(event.target.value)
		}
	}
	handleChildTemplateChange(event) {
		if(this.props.handleParentTemplateChange) {
			this.props.handleParentTemplateChange(event.target.value)
		}
	}

	render() {
		return (
			<div className="email-meta--container">
				<select 
					className="email-meta--template"
					name="EmailTemplates" 
					onChange={this.handleChildTemplateChange}
					value={this.props.selectedTemplate} >
					<option disabled>--Select a Template--</option>
					{this.props.templates.map((cv, i) => {
						return <option value={cv} key={i}>{cv}</option>
					})}
				</select>
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