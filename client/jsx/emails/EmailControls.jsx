import React from 'react'
import PropTypes from 'prop-types'
import autoBind from 'react-autobind'
import classNames from 'classnames'
import axiosClient from '../../lib/axios.js'

class EmailControls extends React.Component {
	constructor() {
		super()
		autoBind(this,
		'handleDelete',
		'handleCopy',
		'handleSearch',
		'handleSearchChange',
		'clearSearch'
		)

		this.state = {
			searchValue: ''
		}
	}

	handleDelete() {
		const ids = Object.keys(this.props.selectedCheckboxes)
		axiosClient.delete('/api/email/delete', {
			params: {
				id : [...ids]
			}
		}).then((success) => {
			this.props.refreshEmailList()
			return success
		}).catch((error) => {
			console.log(error)
		})
	}

	handleSearchChange(e) {
		this.setState({searchValue: e.target.value})
	}

	handleCopy() {
		// guard clause: prevent the duplication of more than one email
		const selected = Object.keys(this.props.selectedCheckboxes)
		if (selected.length !== 1) {
			return null
		}

		axiosClient.post('/api/email/copy', { id: selected[0] })
			.then(res => {
				this.props.refreshEmailList()
				return res.text()
			}).catch(console.log)
	}

	handleSearch() {
		const title = this.state.searchValue
		this.props.triggerSearch(title)
	}

	clearSearch() {
		this.setState({searchValue: ''})
		this.props.refreshEmailList()
	}

	render() {
		this.copyClassNames = classNames({
			'button': true,
			'is-disabled': Object.keys(this.props.selectedCheckboxes).length > 1 ? true : false
		})

		return (
			<div className="box control">
				<button className="button" onClick={this.handleDelete}>Delete</button>
				<button className={this.copyClassNames} onClick={this.handleCopy}>Copy</button>
				<input className="input" type="text" placeholder="Doesn't work yet" value={this.state.searchValue} onChange={this.handleSearchChange} />
				<button className="button" onClick={this.handleSearch}>Search</button>
				<button className="button" onClick={this.clearSearch}>Clear</button>

			</div>
		)
	}
}

EmailControls.propTypes =  {
	selectedCheckboxes: PropTypes.object,
	refreshEmailList: PropTypes.func,
	triggerSearch: PropTypes.func
}

export default EmailControls
