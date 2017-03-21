(
function(doc) {
  var content = {
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    title: doc.title,
    template: doc.template
  }
  emit(doc.updatedAt, content);
})()