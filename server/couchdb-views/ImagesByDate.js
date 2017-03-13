(function (doc) {
	if(doc.size === '150x150') {
		var properties = {
			size: doc.size,
			url: doc.url,
		}
		emit(doc.date, properties);
	}
	
})()