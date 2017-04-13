
const images = {
	_id: '_design/images',
	views: {}
}

images.views.ImagesByDate = {
	map: function(doc) {
		if(doc.size === '150x150') { 
			var properties = { 
				size: doc.size,
				url: doc.url,
				id: doc._id,
				grouping: doc.grouping,
				fileName: doc.filename
			} 
			emit(doc.date, properties);
		}
	}
}

module.exports = images