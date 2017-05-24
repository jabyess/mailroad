import React from 'react'
import PropTypes from 'prop-types'
import EditorTypeRow from './EditorTypeRow'

class EditorTypeContainer extends React.Component {
	constructor() {
		super()
	}

	render() {
		return(
			<div className="editor-container__editors column">
				{this.props.contents.map((content, i) => {
					return (
						<EditorTypeRow
							key={content.id}
							index={i}
							content={content.content}
							editorType={content.editorType}
							componentTitle={content.componentTitle}
							componentTitles={this.props.componentTitles}
							imageURL={this.props.imageURL}
							imageIndex={this.props.imageIndex}
							setImageIndex={this.props.setImageIndex}
							isEditModeActive={this.props.isEditModeActive}
							removeEditorFromContainer={this.props.removeEditorFromContainer}
							updateComponentTitle={this.props.updateComponentTitle}
							updateContentValue={this.props.updateContentValue}
							reorderEditorIndexes={this.props.reorderEditorIndexes}
							updateEventDate={this.props.updateEventDate}
							updateEventTitle={this.props.updateEventTitle}
						/>
					)
				})}
			</div>
		)
	}
}

EditorTypeContainer.propTypes = {
	componentTitles: PropTypes.array,
	contents: PropTypes.array,
	imageURL: PropTypes.string,
	imageIndex: PropTypes.number,
	setImageIndex: PropTypes.func,
	isEditModeActive: PropTypes.bool,
	removeEditorFromContainer: PropTypes.func,
	updateComponentTitle: PropTypes.func,
	updateContentValue: PropTypes.func,
	reorderEditorIndexes: PropTypes.func,
	updateEventDate: PropTypes.func,
	updateEventTitle: PropTypes.func,
}

export default EditorTypeContainer