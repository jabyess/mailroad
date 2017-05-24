import PropTypes from 'prop-types'
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
						value={category.name}
						onChange={this.onChange}
						/>
					<EditorCategory 
						componentTitles={category.componentTitles}
						parentIndex={i}
						{...this.props}
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
	addComponentTitle: PropTypes.func,
	updateComponentTitle: PropTypes.func,
	removeComponentTitle: PropTypes.func,
	categories: PropTypes.array,
	updateCategory: PropTypes.func
}

export default EditorCategories