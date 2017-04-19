import React from 'react'
import autoBind from 'react-autobind'

class SingleHeading extends React.Component {
	constructor() {
		super()

		autoBind(this,
			'handleTextChange',
			'handleCenteredChange',
			'handleUppercaseChange',
			'handleFontChange'
		)
	}

	onTitleChange(e) {
		let componentTitle = e.target.value
		this.props.updateContentValue(componentTitle, this.props.index)
	}

	handleTextChange(e) {
		let headingText = e.target.value
		let newValues = Object.assign({}, this.props.content, { headingText })
		this.props.updateContentValue(newValues, this.props.index)
	}

	handleCenteredChange(e) {
		let centered = e.target.checked
		let newValues = Object.assign({}, this.props.content, { centered })
		this.props.updateContentValue(newValues, this.props.index)
	}

	handleFontChange(e) {
		let fontSize = e.target.value
		let newValues = Object.assign({}, this.props.content, { fontSize })
		this.props.updateContentValue(newValues, this.props.index)
	}

	handleUppercaseChange(e) {
		let uppercase = e.target.checked
		let newValues = Object.assign({}, this.props.content, { uppercase })
		this.props.updateContentValue(newValues, this.props.index)
	}

	render() {
		let { content } = this.props
		return(
			<div className="singleHeading box">
				<div className="singleHeading__title">
					<h1 className="title">Single Heading</h1>
				</div>
				<select 
					className="select" 
					type="select" 
					value={this.props.componentTitle}
					onChange={this.onTitleChange}
				>
					{this.props.componentTitles.map((title, i) => {
						return <option key={i} value={title.title}>{title.title}</option>
					})}
				</select>
				<div className="singleHeading__inputs">
					<div className="control is-horizontal">
						<label htmlFor="" className="control-label">Centered</label>
						<input 
							type="checkbox"
							className="control checkbox"
							onChange={this.handleCenteredChange}
							checked={content.centered}
						/>
					</div>
					<div className="control is-horizontal">
						<label htmlFor="" className="control-label">Uppercase</label>
						<input 
							type="checkbox"
							className="control checkbox"
							checked={content.uppercase}
							onChange={this.handleUppercaseChange}
						/>
					</div>
					<div className="control is-horizontal">
						<label htmlFor="" className="control-label">Font Size (px)</label>
						<input
						type="number"
						className="control input"
						placeholder="Example: 24"
						value={content.fontSize}
						onChange={this.handleFontChange}
						/>
					</div>
				</div>
				<div className="singleHeading__headingInput control is-horizontal">
					<label htmlFor="" className="control-label">Heading Text</label>
					<input 
						type="text"
						className="control input"
						placeholder="Type your heading text in here"
						onChange={this.handleTextChange}
						value={content.headingText}
					/>
				</div>
			</div>
		)
	}
}

SingleHeading.propTypes = {
	index: React.PropTypes.number,
	updateContentValue: React.PropTypes.func,
	content: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
	componentTitle: React.PropTypes.string,
	componentTitles: React.PropTypes.array
}

export default SingleHeading