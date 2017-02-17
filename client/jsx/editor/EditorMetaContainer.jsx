import React from 'react'
import autoBind from 'react-autobind'

class EditorMetaContainer extends React.Component {

	constructor(props) {
		super(props)

		autoBind(this, 'handleTitleChange', 'handleTemplateChange')

		this.state = {
			template: this.props.template || '', 
			title: this.props.title || ''
		}
	}

	handleTemplateChange(event) {
		if(this.props.handleTemplateChange) {
			this.props.handleTemplateChange(event.target.value)
		}
	}

	handleTitleChange(event) {
		if(this.props.handleTitleChange) {
			this.props.handleTitleChange(event.target.value)
		}
	}

	componentWillReceiveProps (nextProps) {
		this.setState({title: nextProps.title, template: nextProps.template})
	}
		
	render() {
		return (
			<div className="panel">
				<div className="panel-heading">Details</div>
				<div className="panel-block">ID: {this.props._id}</div>
				<div className="panel-block">Created At: {this.props.createdAt}</div>
				<div className="panel-block">Updated At: {this.props.updatedAt}</div>
				<div className="panel-block">
					<span>Template: </span>
					<select
						className="select is-medium email-meta--template"
						name="EmailTemplate"
						onChange={this.handleTemplateChange}
						value={this.state.template}>
						<option disabled>--Select a Template--</option>
						{this.props.templates.map((cv, i) => {
							return <option value={cv} key={i}>{cv}</option>
						})}
					</select>
				</div>
				<div className="panel-block">
					<span>Title: </span>
					<input className="input"
						type="text"
						value={this.state.title}
						onChange={this.handleTitleChange}
					/>
				</div>
			</div> 
		)
	}

}

EditorMetaContainer.propTypes = {
	createdAt: React.PropTypes.string,
	updatedAt: React.PropTypes.string,
	templates: React.PropTypes.array,
	template: React.PropTypes.string,
	title: React.PropTypes.string,
	handleTemplateChange: React.PropTypes.func,
	handleTitleChange: React.PropTypes.func
}

export default EditorMetaContainer