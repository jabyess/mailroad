
import React from 'react'

class EditorCategory extends React.Component {
	constructor() {
		super()

		this.onChange = this.onChange.bind(this)
		this.addTitle = this.addTitle.bind(this)
		this.removeTitle = this.removeTitle.bind(this)
	}

	onChange(e) {
		const value = e.target.value
		const index = e.target.dataset.index

		this.props.updateComponentTitle(this.props.parentIndex, index, value)
	}

	addTitle() {
		this.props.addComponentTitle(this.props.parentIndex)
	}

	removeTitle() {
		this.props.removeComponentTitle(this.props.parentIndex)
	}

	render() {
		const titles = this.props.componentTitles.map((title, i) => {
			return (
				<input 
					data-index={i}
					onChange={this.onChange}
					key={i}
					type="text"
					value={title.title}
					className="input"
				/>
			)
		})

		return (
			<div>
				<button className="button" onClick={this.addTitle}>Add Title</button>
				<button className="button" onClick={this.removeTitle}>Remove Title</button>
				{titles}
			</div>
		)

	}
}

EditorCategory.propTypes = {
	addComponentTitle: React.PropTypes.func,
	updateComponentTitle: React.PropTypes.func,
	removeComponentTitle: React.PropTypes.func,
	parentIndex: React.PropTypes.number,
	componentTitles: React.PropTypes.array
}

export default EditorCategory