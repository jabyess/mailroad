import React from 'react'
import { DefaultEditor, EventsCalendar, SingleImage } from './editor-types/EditorTypes'
import ItemTypes from './editor-types/ItemTypes'
import { DragSource } from 'react-dnd'

const dynamicEditorTypes = {
	DefaultEditor,
	EventsCalendar,
	SingleImage
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
					{...this.props}
				/>
			</div>
		)
	}
}

DynamicEditor.propTypes = {
	editorType: React.PropTypes.string,
	connectDragSource: React.PropTypes.func,
	isEditModeActive: React.PropTypes.bool,
	index: React.PropTypes.number,
	imageIndex: React.PropTypes.number,
	imageURL: React.PropTypes.string,
	setImageIndex: React.PropTypes.func,
	removeEditorFromContainer: React.PropTypes.func,
	content:  React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object, React.PropTypes.array]),
	componentTitle: React.PropTypes.string,
	componentTitles: React.PropTypes.array,
	updateComponentTitle: React.PropTypes.func,
	updateContentValue: React.PropTypes.func,
}


export default DragSource('DefaultEditor', dynamicEditorSource, collect)(DynamicEditor)