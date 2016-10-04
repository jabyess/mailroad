import React from 'react';

class SectionComponentList extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<option>{this.props.component}</option>
		)
	}
}

export default SectionComponentList;