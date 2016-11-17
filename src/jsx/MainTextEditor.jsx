import React from 'react'
import RichTextEditor from 'react-rte'
import autoBind from 'react-autobind'

class MainTextEditor extends React.Component {
	constructor(props) {
		super(props)

		autoBind(this, 'handleEditorChange')

		this.state = {
			value: RichTextEditor.createEmptyValue()
		}
	}

	handleEditorChange(value) {
		this.setState({value})
		// enable this later as needed for live change updates.
		// if(this.props.onChange) {
		// 	this.props.onChange(this.state.value)
		// }
	}

	getCurrentValue() {
		if(this.props.getCurrentValueFromChild) {
			this.props.getCurrentValueFromChild(this.state.value, this.props.index)
		}
	}
	componentDidMount () {
		if(this.props.initialValue){
			this.setState({value: RichTextEditor.createValueFromString(this.props.initialValue, 'html')})
		}
	}
	
	render() {
		return(
			<RichTextEditor
				className="rte-base"
				value={this.state.value}
				onChange={this.handleEditorChange}
				toolbarConfig={this.props.toolbarConfig}
			/>
		)
	}
}

MainTextEditor.propTypes = {
	onChange: React.PropTypes.func,
	getCurrentValueFromChild: React.PropTypes.func,
	toolbarConfig: React.PropTypes.object
}


export default MainTextEditor;