import React from 'react'
import { DropTarget } from 'react-dnd'
import ItemTypes from './editor-types/ItemTypes.js'


const ItemTypesList = () => {
	let ITArray = []
	for(let it in ItemTypes) {
		ITArray.push(ItemTypes[it])
	}
	return ITArray
}
const ItemTypesArray = ItemTypesList()

const editorTypeDropTarget = {
	drop: (props, monitor) => {
		if(monitor.didDrop()) {
			return
		}
		let item = monitor.getItem()
		props.reorderEditorIndexes(item.index, props.index)
	}
}

let collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver()
	}

}
class EditorTypeRow extends React.Component {

	constructor() {
		super()

		this.removeEditor = this.removeEditor.bind(this)
	}

	removeEditor() {
		if(this.props.removeEditorFromContainer) {
			this.props.removeEditorFromContainer(this.props.index)
		}
	}

	render() {
		let { connectDropTarget, isOver } = this.props
		let isOverCSS = isOver ? {border: '2px solid #a9c873' } : {}
		let isEditModeActive = this.props.isEditModeActive

		return connectDropTarget(
		<div className="editor-type-row" style={isOverCSS}>
		{isEditModeActive ? 
			<button className="button" onClick={this.removeEditor}>X</button>
			: ''
		}
		{this.props.children}
		</div>
		)

	}
}

EditorTypeRow.propTypes = {
	children: React.PropTypes.element,
	isEditModeActive: React.PropTypes.bool,
	removeEditorFromContainer: React.PropTypes.func,
	index: React.PropTypes.number,
	connectDropTarget: React.PropTypes.func,
	isOver: React.PropTypes.bool
}

export default DropTarget(ItemTypesArray, editorTypeDropTarget, collect)(EditorTypeRow)