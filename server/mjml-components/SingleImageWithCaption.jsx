import React from 'react'
import { MJMLElement } from 'mjml-core'
import Section from 'mjml-section'
import Column from 'mjml-column'
import Image from 'mjml-image'
import Text from 'mjml-text'

const parentTag = ['mj-column', 'mj-hero-content']
const endingTag = true
const selfClosingTag = true
const defaultMJMLDefinition = {
	attributes: {
		'alt': '',
		'border': 'none',
		'border-radius': '0',
		'container-background-color': null,
		'padding-bottom': null,
		'padding-left': null,
		'padding-right': null,
		'padding-top': null,
		'padding': '10px 25px',
		'src': '',
		'target': '_blank',
		'title': '',
		'vertical-align': null,
		'width': null
	}
}

@MJMLElement
class SingleImageWithCaption extends React.Component {
	constructor() {
		super()


	}

	renderCaption() {

	}

	render() {
		const { imageURL, caption } = this.props
		return(
			<Section>

			</Section>
		)
	}
}

SingleImageWithCaption.propTypes = {
	imageURL: React.PropTypes.string,
	caption: React.PropTypes.string

}

SingleImageWithCaption.tagName = 'singleImage'
SingleImageWithCaption.parentTag = parentTag
SingleImageWithCaption.selfClosingTag = selfClosingTag
SingleImageWithCaption.endingTag = endingTag
SingleImageWithCaption.defaultMJMLDefinition = defaultMJMLDefinition

export default SingleImageWithCaption