import React from 'react'
import { Editor, Html } from 'slate'
import autoBind from 'react-autobind'
import { debounce } from '../../../lib/utils.js'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes.js'

const BLOCK_TAGS = {
	p: 'paragraph',
	blockquote: 'quote',
	pre: 'code',
	div: 'div',
}

const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underline',
}

const rules = [
	{
		deserialize(el, next) {
			const type = BLOCK_TAGS[el.tagName]
			if(!type) return
			return {
				kind: 'block',
				type: type,
				nodes: next(el.children)
			}
		},
		serialize(object, children) {
      if (object.kind != 'block') return
      switch (object.type) {
        case 'paragraph': return <p>{children}</p>
        case 'quote': return <blockquote>{children}</blockquote>
        case 'code': return <pre><code>{children}</code></pre>
      }
		}
	},
	{
		deserialize(el, next) {
      const type = MARK_TAGS[el.tagName]
      if (!type) return
      return {
        kind: 'mark',
        type: type,
        nodes: next(el.children)
      }
    },
    serialize(object, children) {
      if (object.kind != 'mark') return
      switch (object.type) {
        case 'bold': return <strong>{children}</strong>
        case 'italic': return <em>{children}</em>
        case 'underline': return <u>{children}</u>
      }
    }
	}
]

const defaultEditorSource = {
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

let html = new Html({ rules })

class DefaultEditor extends React.Component {

	constructor(props) {
		super(props)

		autoBind(this,
			'onChange',
			'onDocumentChange',
			'onTitleChange'
		)

		this.debounceDocChange = debounce(this.onDocumentChange, 500)

		this.state = {
			state: html.deserialize(this.props.content),
			schema: {
				nodes: {
					code: props => <pre {...props.attributes}>{props.children}</pre>,
					paragraph: props => <p {...props.attributes}>{props.children}</p>,
					quote: props => <blockquote {...props.attribtes}>{props.children}</blockquote>,
					div: props => <div {...props.attributes}>{props.children}</div>
				},
				marks: {
					bold: props => <strong>{props.children}</strong>,
					italic: props => <em>{props.children}</em>,
					underline: props => <u>{props.children}</u>,
				}
			}
		}
	}

	onChange(state) {
		this.setState({state})
	}

	componentWillReceiveProps(nextProps) {
		let content = html.deserialize(nextProps.content)
		this.setState(() => {
			this.state.state = content 
		}) 
	}
	
	onDocumentChange(document, state) {
		let updatedContent = html.serialize(state)
		this.props.updateParentStateContent(updatedContent, this.props.index)
	}

	onTitleChange(event) {
		event.persist()
		this.setState({title: event.target.value})
		let title = event.target.value
		if(this.props.updateComponentTitle) {
			this.props.updateComponentTitle(title, this.props.index)
		}
	}

	render() {
		const { isDragging, connectDragSource, text } = this.props
		return connectDragSource(
			<div className="slate-editor">
				<div className="component-title">
					<label>Section Title</label>
					<input type="text" value={this.props.componentTitle} onChange={this.onTitleChange} />
				</div>
				<Editor
					state={this.state.state}
					schema={this.state.schema}
					onDocumentChange={this.debounceDocChange}
					onChange={this.onChange}
				/>
			</div>
		)
	}
}

export default DragSource(ItemTypes.DEFAULTEDITOR, defaultEditorSource, collect)(DefaultEditor)