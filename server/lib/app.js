const dotenv = require("dotenv")
const express = require("express")
const app = express()
const gzipStatic = require("connect-gzip-static")
const expressSession = require("express-session")
const RedisStore = require("connect-redis")(expressSession)
const redisClient = require("./redis.js")
const paths = require("../../config/paths")
const passport = require("../routes/auth.js")

dotenv.config()

const { SESSION_SECRET } = process.env

// app config (sessions, headers, and authentication)

app.disable("x-powered-by")
app.set("etag", false)
app.set("json spaces", process.env.PRODUCTION ? 0 : 2) // standardize json life
app.set("trust proxy", true)

// proto overwrite
app.all("*", (req, res, next) => {
	req.headers["x-forwarded-proto"] = "https"
	next()
})

app.use("/public", gzipStatic(paths.build))

app.use(
	expressSession({
		store: new RedisStore({
			client: redisClient,
			ttl: 86400, // 24 hours
			prefix: "sess-"
		}),
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		session: true,
		cookie: {
			httpOnly: true,
			secure: false,
			maxAge: 1000 * 60 * 60 * 24 // 1 day
		}
	})
)

passport.init(app)
app.use("/api", passport.verifySession)

// routes (api, logging, and catchalls)

app.use("/", require("../routes"))

app.get("/__health-check__", (req, res) => {
	res
		.set({
			"Content-Type": "text/plain",
			Connection: "close"
		})
		.status(200)
		.send("OK")
		.end()
	return null
})

app.get("*", passport.verifySession, (req, res) => {
	res.sendFile(
		"index.html",
		{
			root: process.env.PWD + "/public"
		},
		err => {
			if (err) {
				console.log("err sendFile ", err)
			}
		}
	)
})

module.exports = app
