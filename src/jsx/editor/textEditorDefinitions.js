let textEditorDefinitions = {
	defaultEditor : {
		// Optionally specify the groups to display (displayed in the order listed).
		display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'LINK_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
		INLINE_STYLE_BUTTONS: [
			{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
			{label: 'Italic', style: 'ITALIC'},
			{label: 'Underline', style: 'UNDERLINE'}
		],
		BLOCK_TYPE_DROPDOWN: [
			{label: 'Normal', style: 'unstyled'},
			{label: 'Heading Large', style: 'header-one'},
			{label: 'Heading Medium', style: 'header-two'},
			{label: 'Heading Small', style: 'header-three'}
		],
		BLOCK_TYPE_BUTTONS: [
			{label: 'UL', style: 'unordered-list-item'},
			{label: 'OL', style: 'ordered-list-item'}
		]
	},
	minimalEditor: {
		display: ['INLINE_STYLE_BUTTONS'],
		INLINE_STYLE_BUTTONS: [
			{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
			{label: 'Italic', style: 'ITALIC'},
			{label: 'Underline', style: 'UNDERLINE'}
		]
	},
	thirdEditor: {
		display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'LINK_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'HISTORY_BUTTONS'],
		INLINE_STYLE_BUTTONS: [
			{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
			{label: 'Italic', style: 'ITALIC'},
			{label: 'Underline', style: 'UNDERLINE'}
		],
		BLOCK_TYPE_DROPDOWN: [
			{label: 'Normal', style: 'unstyled'},
			{label: 'Heading Large', style: 'header-one'},
			{label: 'Heading Medium', style: 'header-two'},
			{label: 'Heading Small', style: 'header-three'}
		],
		BLOCK_TYPE_BUTTONS: [
			{label: 'UL', style: 'unordered-list-item'},
			{label: 'OL', style: 'ordered-list-item'}
		]
	}
}

export default textEditorDefinitions;