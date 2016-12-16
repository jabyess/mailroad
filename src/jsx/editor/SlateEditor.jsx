import React from 'react'
import { Editor, Html, Raw } from 'slate'
import autoBind from 'react-autobind'

export default class SlateEditor extends React.Component {
	constructor(props) {
		super(props)

		autoBind(this, 'onChange', 'determineInitialState')

		// console.log(this.props)
		this.realState = Raw.deserialize({
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
			state: this.realState
		}
	}

	onChange(state) {
		this.setState({state})
	}

	determineInitialState(content) {
		console.log(content.content)
	}

	componentWillReceiveProps (nextProps) {
		this.setState({emailContent: nextProps.emailContent})
	}

	componentDidUpdate () {
		console.log("emailContent ", this.state.emailContent);
	}
	

	render() {
		return (
			<div className=''>
				<Editor
					state={this.state.state} 
					onChange={this.onChange}
				/>
			</div>
		)
	}

}	