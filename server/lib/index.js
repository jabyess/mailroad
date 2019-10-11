const app = require("./app.js")
const PORT = process.env.PORT || 5555

app.listen(PORT, () => {
	console.log(`Express listening on port ${PORT}!`)
})
