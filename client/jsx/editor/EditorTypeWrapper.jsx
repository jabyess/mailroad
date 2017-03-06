import React from 'react'
import EditorTypeRow from './EditorTypeRow.jsx'
import shortid from 'shortid'

class EditorTypeWrapper extends React.Component {

	constructor() {
		super()
		this.keys = []
	}

	componentWillReceiveProps (nextProps) {
		const lengthDifference = nextProps.content.length - this.keys.length

		for(let i = 0; i < lengthDifference; i++) {
			this.keys.push(shortid.generate())
		}

		// if(nextProps.content && this.keys.length < nextProps.content.length) {
		// 	this.keys.push(shortid.generate())
		// }
	}

	render() {
		let { isEditModeActive } = this.props

		return (
			<div className="editor-type-wrapper">
				{this.props.content.map((content, i) => {
					return (
						<EditorTypeRow
							key={this.keys[i]}
							imageURL={this.props.imageURL}
							setImageIndex={this.props.setImageIndex}
							index={i}
							imageIndex={this.props.imageIndex}
							content={content.content}
							componentTitles={this.props.componentTitles}
							componentTitle={content.componentTitle}
							editorType={content.editorType}
							isEditModeActive={isEditModeActive}
							removeEditorFromContainer={this.props.removeEditorFromContainer}
							updateComponentTitle={this.props.updateComponentTitle}
							updateContentValue={this.props.updateContentValue}
							reorderEditorIndexes={this.props.reorderEditorIndexes}
						/>
					)
				})}
			</div>
		)
	}
}

EditorTypeWrapper.propTypes = {
	updateComponentTitle: React.PropTypes.func,
	updateContentValue: React.PropTypes.func,
	isEditModeActive: React.PropTypes.bool,
	removeEditorFromContainer: React.PropTypes.func,
	index: React.PropTypes.number,
	connectDropTarget: React.PropTypes.func,
	isOver: React.PropTypes.bool,
	content: React.PropTypes.array,
	reorderEditorIndexes: React.PropTypes.func
}

export default EditorTypeWrapper