import React from 'react'
import autoBind from 'react-autobind'
import PDB from '../../pouchdb/pouchdb.js'

export default class EditorMetaContainer extends React.Component {

	constructor(props) {
		super(props);

		autoBind(this, 'handleTitleChange', 'handleTemplateChange')

		this.pouchDB = new PDB('pdb_emailcontent')

		this.state = {
			template: '',
			title: ''
		}
	}

	handleTitleChange(event) {
	this.setState({title: event.target.value}, () => {
		let doc = {
			id: this.props.id,
			title: this.state.title
		}
		this.pouchDB.createOrUpdateDoc(doc)
	})
		
		
	}

	handleTemplateChange(event) {
		this.setState({template: event.target.value}, () => {
			let doc = {
				id: this.props.id,
				template: this.state.template
			}
			this.pouchDB.createOrUpdateDoc(doc)
		})


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