import React from 'react'
import EditorCategory from './EditorCategory.jsx'

class EditorCategories extends React.Component {
	constructor() {
		super()

		this.onChange = this.onChange.bind(this)
	}

	onChange(e) {
		const value = e.target.value
		const index = e.target.dataset.index
		this.props.updateCategory(index, value)
	}

	render() {
		const cats = this.props.categories.map((category, i) => {
			return (
				<div className="admin-editor-categories" key={i}>
					<input
						data-index={i}
						type="text"
						className="input is-large"
						value={category.category.name}
						onChange={this.onChange}
						/>
					<EditorCategory 
						updateComponentTitle={this.props.updateComponentTitle}
						componentTitles={category.category.componentTitles}
						addComponentTitle={this.props.addComponentTitle}
						removeComponentTitle={this.props.removeComponentTitle}
						parentIndex={i}
					/>
				</div>
			)
		})

		return (
			<div>
				{cats}
			</div>
		)
	}
}

EditorCategories.propTypes = {
	addComponentTitle: React.PropTypes.func,
	updateComponentTitle: React.PropTypes.func,
	removeComponentTitle: React.PropTypes.func,
	categories: React.PropTypes.array,
	updateCategory: React.PropTypes.func
}

export default EditorCategories