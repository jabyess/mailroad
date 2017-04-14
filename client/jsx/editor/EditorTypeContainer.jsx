import React from 'react'
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
	componentTitles: React.PropTypes.array,
	imageURL: React.PropTypes.string,
	imageIndex: React.PropTypes.number,
	setImageIndex: React.PropTypes.func,
	isEditModeActive: React.PropTypes.bool,
	removeEditorFromContainer: React.PropTypes.func,
	updateComponentTitle: React.PropTypes.func,
	updateContentValue: React.PropTypes.func,
	reorderEditorIndexes: React.PropTypes.func,
	updateEventDate: React.PropTypes.func,
	updateEventTitle: React.PropTypes.func,


}

export default EditorTypeContainer