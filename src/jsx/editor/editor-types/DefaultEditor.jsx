import React from 'react'
import { Editor, Html } from 'slate'
import autoBind from 'react-autobind'
import { debounce } from '../../../lib/utils.js'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes.js'
import PDB from '../../../pouchdb/pouchdb.js'

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
			'setLocalStorageItem',
			'getLocalStorageItem',
		)

		this.debounceDocChange = debounce(this.onDocumentChange, 1000)

		this.pouchDB = new PDB('pdb_emailcontent')

		this.state = {
			state: html.deserialize(this.props.content),
			schema: {
				nodes: {
					code: props => <pre {...props.attributes}>{props.children}</pre>,
					paragraph: props => <p {...props.attributes}>{props.children}</p>,
					quote: props => <blockquote {...props.attributes}>{props.children}</blockquote>,
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

	setLocalStorageItem(key, val) {
		window.localStorage.setItem(key, JSON.stringify(val))
	}

	getLocalStorageItem(key) {
		let value = window.localStorage.getItem(key)
		return value && JSON.parse(value)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({state: html.deserialize(nextProps.content)})
	}
	
	onDocumentChange(document, state) {
	  let content =	html.serialize(state)
		let docObject = {
			_id: 'pdb_' + this.props.emailID,
			emailContent: content,
			editorType: this.props.editorType,
			index: this.props.index
		}
		this.pouchDB.partialDocUpdate(docObject)
	}

	debounceDocChange(document, state) {
		this.onDocumentChange(document, state)
	}

	render() {
		const { isDragging, connectDragSource, text } = this.props
		return connectDragSource(
			<div className="slate-editor">
				<Editor
					state={this.state.state}
					schema={this.state.schema}
					onChange={this.onChange}
					onDocumentChange={this.debounceDocChange}
				/>
			</div>
		)
	}
}

export default DragSource(ItemTypes.DEFAULTEDITOR, defaultEditorSource, collect)(DefaultEditor)