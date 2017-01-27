import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import * as EditorTypes from './EditorTypes.js'

export default class EditorTypeSelect extends React.Component {
	constructor() {
		super();

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
		let valArray = [];
		for(let i = 0; i < e.target.length; i++) {
			let option = e.target[i]
			if(option.selected) { valArray.push(option.value) }
		}
		this.setState({value: valArray})
	}

	render() {
		return (
			<div className="editor-types">
				<button onClick={() => this.addComponentToPage()}>Add</button>
				<select 
					multiple
					value={this.state.value}
					className="editor-types__select"
					onChange={this.handleChange} >
					{this.state.editorTypeList.map((currentValue, i) => {
						return (
							<option value={currentValue} key={i}>{currentValue}</option>
						)
					})}
				</select>
			</div>
		);
	}
}


