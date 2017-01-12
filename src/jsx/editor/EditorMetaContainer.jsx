import React from 'react'
import autoBind from 'react-autobind'
import PDB from '../../pouchdb/pouchdb.js'

export default class EditorMetaContainer extends React.Component {

	constructor(props) {
		super(props);

		autoBind(this, 'handleTitleChange', 'handleTemplateChange')

		this.pouchDB = new PDB('pdb_emailcontent')

		this.state = {
			template: this.props.template, 
			title: this.props.title
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
			<div className="email-meta--container">
				<select 
				className="email-meta--template"
				name="EmailTemplate"
				onChange={this.handleTemplateChange}
				value={this.state.template}>
					<option disabled>--Select a Template--</option>
					{this.props.templates.map((cv, i) => {
						return <option value={cv} key={i}>{cv}</option>
					})}
				</select>
				<input className="email-meta--title"
					type="text"
					value={this.state.title}
					onChange={this.handleTitleChange}
				/>
				<div className="email-meta--id">{this.props.id}</div>
				<div className="email-meta--created-at">{this.props.createdAt}</div>
				<div className="email-meta--updated-at">{this.props.updatedAt}</div>
			</div> 
		)
	}

}