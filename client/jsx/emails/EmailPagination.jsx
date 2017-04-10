import React from 'react'

class EmailPagination extends React.Component {
	constructor() {
		super()
	}

	render() {
		const showNext = (this.props.emailsPerPage * this.props.page) < this.props.totalRows ? 
			<button className="button pagination-next" onClick={this.props.pageNext}>Next</button> 
			: null
		const showPrev = (this.props.page > 1) ? 
			<button className="button pagination-previous" onClick={this.props.pagePrev}>Previous</button> 
			: null
		return (
			<nav className="pagination">
				{showPrev}
				{showNext}
			</nav>
		)
	}
}

EmailPagination.propTypes = {
	pageNext: React.PropTypes.func,
	pagePrev: React.PropTypes.func,
	page: React.PropTypes.number,
	emailsPerPage: React.PropTypes.number,
	totalRows: React.PropTypes.number
}
export default EmailPagination