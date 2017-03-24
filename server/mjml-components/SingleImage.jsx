import React from 'react'
import { MJMLElement } from 'mjml-core'
import Section from 'mjml-section'
import Column from 'mjml-column'
import Image from 'mjml-image'
import Text from 'mjml-text'

@MJMLElement
class SingleImage extends React.Component {
	constructor() {
		super()
	}

	render() {
		return(
			<div className="div"></div>

		)
	}
}

SingleImage.propTypes = {

}

export default SingleImage