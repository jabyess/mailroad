import React from 'react';
import RichTextEditor from 'react-rte';

class MainTextEditor extends React.Component {
	constructor(props) {
		super(props)
		this.handleEditorChange = this.handleEditorChange.bind(this)
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
		// console.log('triggered');
		// return this.state.value;
		console.log(this.props);
		if(this.props.getCurrentValueFromChild) {
			this.props.getCurrentValueFromChild(this.state.value)
		}
	}
	
	// triggerCurrentValue() {
	// 	this.getCurrentValue();
	// }

	componentDidMount() {
		// window.addEventListener('saveHTMLButtonClicked', () => {
		// 	this.triggerCurrentValue();
		console.log(this.props);
		// })
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