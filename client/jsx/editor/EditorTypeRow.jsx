import React from 'react'
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
			<div style={isOverCSS}>
				<DynamicEditor
					index={this.props.index}
					imageURL={this.props.imageURL}
					imageIndex={this.props.imageIndex}
					setImageIndex={this.props.setImageIndex}
					isEditModeActive={this.props.isEditModeActive}
					content={this.props.content}
					componentTitles={this.props.componentTitles}
					componentTitle={this.props.componentTitle}
					editorType={this.props.editorType}
					updateComponentTitle={this.props.updateComponentTitle}
					updateContentValue={this.props.updateContentValue}
					removeEditorFromContainer={this.props.removeEditorFromContainer}
				/>
			</div>
		)
	}
}

EditorTypeRow.propTypes = {
	index: React.PropTypes.number,
	imageURL: React.PropTypes.string,
	imageIndex: React.PropTypes.number,
	setImageIndex: React.PropTypes.func,
	isEditModeActive:  React.PropTypes.bool,
	content:  React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]),
	componentTitles:  React.PropTypes.array,
	componentTitle:  React.PropTypes.string,
	editorType:  React.PropTypes.string,
	updateComponentTitle: React.PropTypes.func,
	updateContentValue: React.PropTypes.func,
	removeEditorFromContainer: React.PropTypes.func,
	isOver: React.PropTypes.bool,
	connectDropTarget: React.PropTypes.func,
}

export default DropTarget(ItemTypesArray, editorTypeRowDropTarget, collect)(EditorTypeRow)