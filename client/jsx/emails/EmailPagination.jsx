import React from 'react'


class EmailPagination extends React.Component {
	constructor() {
		super()

		this.makeTotalPages = this.makeTotalPages.bind(this)
		this.skipToPage = this.skipToPage.bind(this)
	}

	makeTotalPages(length) {
		let arr = []
		for(var i = 1; i <= length; i++) {
			arr.push(i)
		}
		return arr
	}

	skipToPage(e) {
		if(this.props.skipToPage) {
			const page = parseInt(e.target.dataset.page, 10)
			this.props.skipToPage(page)
		}
	}

	render() {
		const nextDisabled = (this.props.emailsPerPage * this.props.page) < this.props.totalRows ? false : true
		const prevDisabled = (this.props.page > 1) ? false : true
		const totalPages = this.makeTotalPages( Math.floor(this.props.totalRows / this.props.emailsPerPage) + 1 )
		const showNumbers = (
			<ul className="pagination-list">
				<span className="pagination-ellipsis">{this.props.totalRows} Emails </span>
				{totalPages.map((page) => {
					if(page === this.props.page) {
						return (<li 
						key={page} 
						onClick={this.skipToPage}
						data-page={page}>
							<a className="pagination-link is-current">{page}</a>
						</li>
						)
					}
					else return (
						<li 
						key={page} 
						onClick={this.skipToPage}
						data-page={page}>
							<a className="pagination-link">{page}</a>
						</li>
					)
				})}
			</ul>
			)
		
		return (
			<nav className="pagination is-centered">
				<button className="button pagination-previous" disabled={prevDisabled} onClick={this.props.pagePrev}>Previous Page</button>
				{showNumbers}
				<button className="button pagination-next" disabled={nextDisabled} onClick={this.props.pageNext}>Next Page</button>
			</nav>
		)
	}
}

EmailPagination.propTypes = {
	pageNext: React.PropTypes.func,
	pagePrev: React.PropTypes.func,
	page: React.PropTypes.number,
	emailsPerPage: React.PropTypes.number,
	totalRows: React.PropTypes.number,
	skipToPage: React.PropTypes.func
}
export default EmailPagination