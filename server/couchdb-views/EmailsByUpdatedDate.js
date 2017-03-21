(
function(doc) {
  var content = {
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    title: doc.title,
    template: doc.template,
		category: doc.category
  }
  emit(doc.updatedAt, content);
})
()