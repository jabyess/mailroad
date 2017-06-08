import React from 'react'
import PropTypes from 'prop-types'
import * as dynamicEditorTypes from './editor-types/EditorTypes'
import ItemTypes from './editor-types/ItemTypes'
import { DragSource } from 'react-dnd'

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
		const renderControls = isEditModeActive ? (
			<div className="editor-container-row__controls">
				<button className="button is-danger is-outlined" onClick={this.removeEditor}>X</button>
				<button className="button is-success is-outlined editor-container-row__controls__drag">...</button>
			</div>
		) : null

		return connectDragSource(
			<div className="editor-container-row">
				{renderControls}
				<DynamicEditorType
					{...this.props}
				/>
			</div>
		)
	}
}

DynamicEditor.propTypes = {
	editorType: PropTypes.string,
	connectDragSource: PropTypes.func,
	isEditModeActive: PropTypes.bool,
	index: PropTypes.number,
	imageIndex: PropTypes.number,
	imageURL: PropTypes.string,
	setImageIndex: PropTypes.func,
	removeEditorFromContainer: PropTypes.func,
	content:  PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
	componentTitle: PropTypes.string,
	componentTitles: PropTypes.array,
	updateComponentTitle: PropTypes.func,
	updateContentValue: PropTypes.func,
}


export default DragSource('DefaultEditor', dynamicEditorSource, collect)(DynamicEditor)