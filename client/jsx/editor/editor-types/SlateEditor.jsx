import React from 'react'
import { Editor, Html } from 'slate'
import autoBind from 'react-autobind'
import { debounce } from '../../../lib/utils.js'

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

let html = new Html({ rules })


export default class SlateEditor extends React.Component {

	constructor(props) {
		super(props)

		autoBind(this,
			'onChange',
			'onDocumentChange',
			'setLocalStorageItem',
			'getLocalStorageItem',
		)

		this.debounceDocChange = debounce(this.onDocumentChange, 1000)

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
		this.setLocalStorageItem('testkey', content)
	}

	debounceDocChange(document, state) {
		this.onDocumentChange(document, state)
	}

	render() {
		return (
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
