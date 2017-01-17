import React from 'react'
import { Editor, Html } from 'slate'
import autoBind from 'react-autobind'
import { debounce } from '../../../lib/utils.js'
import { DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes.js'

const DEFAULT_NODE = 'paragraph'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    'block-quote': props => <blockquote {...props.attributes}>{props.children}</blockquote>,
    'bulleted-list': props => <ul {...props.attributes}>{props.children}</ul>,
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    'list-item': props => <li {...props.attributes}>{props.children}</li>,
    'numbered-list': props => <ol {...props.attributes}>{props.children}</ol>,
  },
  marks: {
    bold: {
      fontWeight: 'bold'
    },
    code: {
      fontFamily: 'monospace',
      backgroundColor: '#eee',
      padding: '3px',
      borderRadius: '4px'
    },
    italic: {
      fontStyle: 'italic'
    },
    underlined: {
      textDecoration: 'underline'
    }
  }
}

const BLOCK_TAGS = {
	p: 'paragraph',
	blockquote: 'quote',
	headingOne: 'heading-one',
	headingTwo: 'heading-two',
	div: 'div',
	listItem: 'list-item',
	numberedList: 'numbered-list'
}

const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  underlined: 'underlined',
	code: 'code'
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
			console.log(object.type)
      switch (object.type) {
				case 'heading-one': return <h1>{children}</h1>
				case 'heading-two': return <h2>{children}</h2>
        case 'paragraph': return <p>{children}</p>
        case 'quote': return <blockquote>{children}</blockquote>
				case 'numbered-list' : return <ol>{children}</ol>
				case 'bulleted-list': return <ul>{children}</ul>
				case 'list-item': return <li>{children}</li>
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
        case 'underlined': return <span style={{textDecoration: "underline"}}>{children}</span>
				case 'code': return <code>{children}</code>
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
			'onTitleChange',
			'onKeyDown'
		)

		this.debounceDocChange = debounce(this.onDocumentChange, 500)

		this.state = {
			state: html.deserialize(this.props.content)
		}
	}


 /**
   * Check if the current selection has a mark with `type` in it.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasMark(type) {
    const { state } = this.state
    return state.marks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock(type) {
    const { state } = this.state
    return state.blocks.some(node => node.type == type)
  }

  /**
   * On key down, if it's a formatting command toggle a mark.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State}
   */

  onKeyDown(e, data, state) {
    if (!data.isMod) return
    let mark

    switch (data.key) {
      case 'b':
        mark = 'bold'
        break
      case 'i':
        mark = 'italic'
        break
      case 'u':
        mark = 'underlined'
        break
      case '`':
        mark = 'code'
        break
      default:
        return
    }

    state = state
      .transform()
      .toggleMark(mark)
      .apply()

    e.preventDefault()
    return state
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} e
   * @param {String} type
   */

  onClickMark(e, type) {
    e.preventDefault()
    let { state } = this.state

    state = state
      .transform()
      .toggleMark(type)
      .apply()

    this.setState({ state })
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} e
   * @param {String} type
   */

	onClickBlock(e, type) {
    e.preventDefault()
    let { state } = this.state
    let transform = state.transform()
    const { document } = state

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      }

      else {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
      }
    }
    // Handle the extra wrapping required for list buttons.
    else {
      const isList = this.hasBlock('list-item')
      const isType = state.blocks.some((block) => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        transform
          .unwrapBlock(type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list')
          .wrapBlock(type)
      } else {
        transform
          .setBlock('list-item')
          .wrapBlock(type)
      }
    }

    state = transform.apply()
    this.setState({ state })
  }

	renderToolbar() {
    return (
      <div className="menu toolbar-menu">
        {this.renderMarkButton('bold', 'fa-bold')}
        {this.renderMarkButton('italic', 'fa-italic')}
        {this.renderMarkButton('underlined', 'fa-underline')}
        {this.renderMarkButton('code', 'fa-code')}
        {this.renderBlockButton('heading-one', 'fa-header')}
        {this.renderBlockButton('heading-two', 'fa-header')}
        {this.renderBlockButton('block-quote', 'fa-quote-right')}
        {this.renderBlockButton('numbered-list', 'fa-list-ol')}
        {this.renderBlockButton('bulleted-list', 'fa-list-ul')}
      </div>
    )
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

	renderMarkButton(type, icon) {
    const isActive = this.hasMark(type)
    const onMouseDown = e => this.onClickMark(e, type)
		const markButtonClass = "fa " + icon

    return (
      <button className="button" onMouseDown={onMouseDown} data-active={isActive}>
				<i className={markButtonClass} aria-hidden="true"></i>
      </button>
    )
  }

	renderBlockButton(type, icon) {
		const isActive = this.hasBlock(type)
    const onMouseDown = e => this.onClickBlock(e, type)
		const blockButtonClass = "fa " + icon

    return (
      <button className="button" onMouseDown={onMouseDown} data-active={isActive}>
				<i className={blockButtonClass} aria-hidden="true"></i>
      </button>
    )
	}

	renderEditor() {
		return (
			<Editor
				spellCheck
				state={this.state.state}
				schema={schema}
				onKeyDown={this.onKeyDown}
				onDocumentChange={this.debounceDocChange}
				onChange={this.onChange}
			/>		
		)
	}

	render() {
		const { isDragging, connectDragSource, text } = this.props
		return connectDragSource(
			<div className="slate-editor">
				<div className="component-title">
					<label>Section Title</label>
					<input type="text" value={this.props.componentTitle} onChange={this.onTitleChange} />
				</div>
				{this.renderToolbar()}
				{this.renderEditor()}
			</div>
		)
	}
}

export default DragSource(ItemTypes.DEFAULTEDITOR, defaultEditorSource, collect)(DefaultEditor)