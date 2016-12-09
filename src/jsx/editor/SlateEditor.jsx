import React from 'react'
import { Editor, Raw } from 'slate'

export default class SlateEditor extends React.Component {
	constructor() {
		super()

		this.initialState = Raw.deserialize({
			nodes: [
				{
					kind: 'block',
					type: 'paragraph',
					nodes: [
						{
							kind: 'text',
							text: 'A line of text in a paragraph.'
						}
					]
				}
			]
		}, { terse: true })

		this.state = {
			state: this.initialState
		}
	}

	onChange(state) {
		this.setState({state})
	}

	render() {
		return (
			<Editor
				state={this.state.state} 
			/>
		)
	}

}	