import React from 'react';
import RichTextEditor from 'react-rte';

class MainTextEditor extends React.Component {
	constructor(props) {
		super(props)
		this.handleEditorChange = this.handleEditorChange.bind(this)
		this.triggerCurrentValue = this.triggerCurrentValue.bind(this);
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

	getCurrentValue(value) {
		if(this.props.currentValue) {
			this.props.currentValue(this.state.value)
		}
	}
	
	triggerCurrentValue() {
		this.getCurrentValue();
	}

	componentDidMount() {
		window.addEventListener('saveHTMLButtonClicked', () => {
			this.triggerCurrentValue();
		})	
	}

	render() {
		return(
			<RichTextEditor
				value={this.state.value}
				onChange={this.handleEditorChange}
				currentValue={this.getCurrentValue}
			/>
		)
	}
}

MainTextEditor.propTypes = {
	onChange: React.PropTypes.func,
	currentValue: React.PropTypes.func
}


export default MainTextEditor;