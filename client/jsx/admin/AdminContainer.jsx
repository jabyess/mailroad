import React from 'react'
import EditorCategories from './EditorCategories.jsx'
import axios from 'axios'
import autoBind from 'react-autobind'

export default class AdminContainer extends React.Component {

	constructor() {
		super()

		autoBind(this,
			'handleSave',
			'updateComponentTitle',
			'updateCategory',
			'addCategory',
			'removeCategory',
			'addComponentTitle',
			'removeComponentTitle'
		)

		this.state = {
			categories: []
		}
	}

	componentDidMount () {
		axios.get('/api/meta/loadConfig', {
			params: {
				config: 'categories'
			}
		})
		.then(response => {
			this.setState({categories: response.data.categories})
		})
		.catch(err => {
			console.log('error', err)
		}) 
	}

	updateComponentTitle(parentIndex, index, value) {
		this.setState((state) => {
			return state.categories[parentIndex].componentTitles[index].title = value
		})
	}

	updateCategory(index, value) {
		this.setState((state) => {
			return state.categories[index].name = value
		})
	}

	addCategory() {
		this.setState((state) => {
			return state.categories.push({
				name: '',
				componentTitles: [{title: ''}]
			})

		})
	}

	removeCategory() {
		this.setState((state) => {
			return state.categories.pop()
		})
	}

	addComponentTitle(parentIndex) {
		this.setState((state) => {
			return state.categories[parentIndex].componentTitles.push({title: ''})
		})	
	}
	
	removeComponentTitle(parentIndex) {
		this.setState((state) => {
			return state.categories[parentIndex].componentTitles.pop()
		})	

	}

	handleSave() {
		const categories = this.state.categories
		axios.post('/api/meta/save', {
			categories
		})
		.then(result => {
			console.log(result)
		})
		.catch(err => {
			console.log(err)
		})
	}

	render() {
		return (
			<div className="columns">
				<div className="column">
					<button className="button" onClick={this.handleSave}>Save</button>

					<p>Admin page under construction</p>
					<p>things to come:</p>
					<ul>
						<li>user options</li>
						<li>idk</li>
					</ul>
				</div>
				
				<div className="column">
					
					<p className="">Editor Categories</p>
					<button className="button" onClick={this.addCategory}>Add</button>
					<button className="button" onClick={this.removeCategory}>Remove</button>
					<EditorCategories
						addComponentTitle={this.addComponentTitle}
						removeComponentTitle={this.removeComponentTitle}
						updateComponentTitle={this.updateComponentTitle}
						categories={this.state.categories}
						updateCategory={this.updateCategory}
					/>
				</div>
			</div>
		)
	}
}