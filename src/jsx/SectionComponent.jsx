import React from 'react';

class SectionComponent extends React.Component {
	render() {
		return (
			<option>{this.props.component}</option>
		)
	}
}

export default SectionComponent;