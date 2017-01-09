import React from 'react'
import { DropTarget } from 'react-dnd'
import ItemTypes from './editor-types/ItemTypes.js'


const ItemTypesList = () => {
	let ITArray = [];
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
	}

	render() {
		let { connectDropTarget, isOver } = this.props
		let isOverCSS = isOver ? {border: "2px solid #a9c873" } : {};

		return connectDropTarget(
		<div className="editor-type-row" style={isOverCSS}>
				{this.props.children}
			</div>
		)

	}
}

export default DropTarget(ItemTypesArray, editorTypeDropTarget, collect)(EditorTypeRow)