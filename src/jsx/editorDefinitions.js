let editorDefinitions = {
	MainMCE : {
		name: 'MainMCE',
		content: '<p>Main</p>',
		config: {
			plugins: 'link image code save',
			toolbar: 'save | undo redo | bold italic | alignleft aligncenter alignright | code',
			height: 400
		}	
	},
	Byline: {
		name: 'Byline',
		content: '<p>Byline</p>',
		config: {
			plugins: 'link image code save',
			toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
			height: 200
		}
	}
}

export default editorDefinitions;