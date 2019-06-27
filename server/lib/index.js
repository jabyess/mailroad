const app = require("./app.js")
const PORT = process.env.PORT || 33224

app.listen(PORT, () => {
	console.log(`Express listening on port ${PORT}!`)
})
