import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import ItemTypes from './editor-types/ItemTypes.js'
import DynamicEditor from './DynamicEditor.jsx'

const ItemTypesList = () => {
	let ITArray = []
	for(let it in ItemTypes) {
		ITArray.push(ItemTypes[it])
	}
	return ITArray
}
const ItemTypesArray = ItemTypesList()

const editorTypeRowDropTarget = {
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
		const { isOver, connectDropTarget } = this.props
		let isOverCSS = isOver ? {border: '2px solid #a9c873' } : {}

		return connectDropTarget(
			<div className="editor-container__editor" style={isOverCSS}>
				<DynamicEditor
					{...this.props}
				/>
			</div>
		)
	}
}

EditorTypeRow.defaultProps = {
	componentTitles: [],
	contents: [],
}

EditorTypeRow.propTypes = {
	index: PropTypes.number,
	imageURL: PropTypes.string,
	imageIndex: PropTypes.number,
	setImageIndex: PropTypes.func,
	isEditModeActive:  PropTypes.bool,
	content:  PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
	componentTitles:  PropTypes.array,
	componentTitle:  PropTypes.string,
	editorType:  PropTypes.string,
	updateComponentTitle: PropTypes.func,
	updateContentValue: PropTypes.func,
	removeEditorFromContainer: PropTypes.func,
	isOver: PropTypes.bool,
	connectDropTarget: PropTypes.func,
}

export default DropTarget(ItemTypesArray, editorTypeRowDropTarget, collect)(EditorTypeRow)