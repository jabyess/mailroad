function (doc) {
  var content = {
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    title: doc.title
  }
  emit(doc.updatedAt, content);
}