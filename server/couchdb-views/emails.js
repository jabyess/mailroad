
const emails = {
	_id : '_design/emails',
	views: {},
}

// these functions must be in es5
emails.views.EmailsByUpdatedDate = {
	map: function(doc) { 
		var content = { 
			createdAt: doc.createdAt, 
			updatedAt: doc.updatedAt,
			title: doc.title,
			template: doc.template, 
			category: doc.category
		} 
		emit(doc.updatedAt, content);
	}
}

module.exports = emails