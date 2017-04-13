import React from 'react'
import * as EditorTypes from './EditorTypes'

class EditorTypeSelect extends React.Component {
	constructor() {
		super()

		this.handleChange = this.handleChange.bind(this)
		this.state = {
			value: [],
			editorTypeList: Object.keys(EditorTypes)
		}
	}
	
	addComponentToPage() {
		if(this.props.addEditorToContainer) {
			this.props.addEditorToContainer(this.state.value)
		}
	}

	handleChange(e) {
		let value = []
		for(let i = 0; i < e.target.length; i++) {
			let option = e.target[i]
			if(option.selected) { value.push(option.value) }
		}
		this.setState({ value })
	}

	render() {
		return (
			<div className="box editorTypeSelect">
				<h1>Add a Component</h1>
				<button className="button" onClick={() => this.addComponentToPage()}>Add</button>
				<select 
					multiple
					value={this.state.value}
					className="textarea is-medium"
					onChange={this.handleChange} >
					{this.state.editorTypeList.map((currentValue, i) => {
						return (
							<option value={currentValue} key={i}>{currentValue}</option>
						)
					})}
				</select>
			</div>
		)
	}
}

EditorTypeSelect.propTypes = {
	addEditorToContainer: React.PropTypes.func
}

export default EditorTypeSelect