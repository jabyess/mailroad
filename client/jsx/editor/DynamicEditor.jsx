import React from 'react'
import { DefaultEditor, DatePicker, DatesPicker } from './editor-types/EditorTypes.js'
import ItemTypes from './editor-types/ItemTypes.js'
import { DragSource } from 'react-dnd'

const dynamicEditorTypes = {
	DefaultEditor, DatePicker, DatesPicker
}

const dynamicEditorSource = {
	beginDrag(props) {
		return {
			text: props.text,
			index: props.index
		}
	},
	endDrag(props) {
		return {
			text: props.text,
			index: props.index
		}
	},
	canDrag(props) {
		return props.isEditModeActive
	}
}

function collect(connect, monitor) {
	return {
		connectDragSource : connect.dragSource(),
		isDragging: monitor.isDragging()
	}
}

const getItemType = (itemTypes, type) => {
	const itemType = type.toUpperCase()
	return itemTypes[itemType]
}

// const itemType = getItemType(ItemTypes, this.props.content.editorType)

class DynamicEditor extends React.Component {
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
		let DynamicEditorType = dynamicEditorTypes[this.props.editorType]
		let { isEditModeActive, connectDragSource } = this.props

		return connectDragSource(
			<div>
				{isEditModeActive ?
					<div className="editor-type-row__controls">
						<button className="button" onClick={this.removeEditor}>X</button>
						<div className="button">...</div>
					</div>
				: '' }
				<DynamicEditorType
					index={this.props.index}
					imageIndex={this.props.imageIndex}
					content={this.props.content}
					setImageIndex={this.props.setImageIndex}
					imageURL={this.props.imageURL}
					componentTitles={this.props.componentTitles}
					componentTitle={this.props.componentTitle}
					editorType={this.props.editorType}
					updateComponentTitle={this.props.updateComponentTitle}
					updateContentValue={this.props.updateContentValue}
				/>
			</div>
		)

	}
}

// DynamicEditor.propTypes = {
// 	editorType: React.PropTypes.string,
// 	connectDragSource: React.PropTypes.func,
// 	isEditModeActive: React.PropTypes.bool,
// 	index: React.PropTypes.number,
// 	content: React.PropTypes.string,
// 	componentTitle: React.PropTypes.string
// }


export default DragSource('DefaultEditor', dynamicEditorSource, collect)(DynamicEditor)