const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const axios = require("axios")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const winston = require("winston")

dotenv.config()

const { AUTH_URL, COUCHDB_URL } = process.env
const jsonParser = bodyParser.json()
const passportjs = {}

const createUser = (username, password) => {
	console.log(`creating user ${username} with pass ${password}`)
	return axios.put(
		`${AUTH_URL}org.couchdb.user:${username}`,
		{
			name: username,
			password,
			roles: [],
			type: "user"
		},
		{
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json"
			}
		}
	)
}

const createSession = (username, password) => {
	return axios.post(
		`${COUCHDB_URL}_session/`,
		// params must be sent in this format. idk why. couchdb amirite.
		`name=${username}&password=${password}`,
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
	)
}

const signup = (username, password, done) => {
	return createUser(username, password)
		.then(user => {
			if (!user) {
				return done(null, false, {
					message: "Error creating user"
				})
			} else {
				return done(null, user.data.user)
			}
		})
		.catch(err => {
			console.error(err)
			done(null, false, err)
		})
}

const parseCookie = cookie => {
	const vals = cookie[0]
	let split = vals.split(";")
	let token = split[0].split("=")
	return token[1]
}

const authenticate = (username, password, done) => {
	return createSession(username, password)
		.then(userObj => {
			if (userObj.data && userObj.data.error) {
				return done(null, false, {
					// unauthorized, username or password etc
					message: userObj.data.reason
				})
			} else {
				if (userObj.headers && userObj.headers["set-cookie"].length > 0) {
					let token = parseCookie(userObj.headers["set-cookie"])
					return done(null, { sessionID: token, username: userObj.data.name })
				}
			}
		})
		.catch(err => {
			console.error(err)
			return done(null, false, err)
		})
}

passportjs.init = app => {
	passport.use("local-login", new LocalStrategy(authenticate))
	passport.use("local-signup", new LocalStrategy(signup))
	app.use(passport.initialize())
	app.use(passport.session())

	passport.serializeUser((user, done) => {
		console.log("serializing user", user)
		if (!user || !user.sessionID) {
			return done(Error("Invalid user object for serialization"))
		}

		// the object stored in redis (key = session_id, val = obj)
		done(null, {
			username: user.username,
			sessionID: user.sessionID
		})
	})

	passport.deserializeUser((user, done) => {
		console.log("de-serializing user", user)
		if (!user || !user.sessionID) {
			const err = "Invalid user for deserialization"
			winston.error(err)
			return done(Error(err))
		}

		return done(null, user)
	})

	app.post(
		"/api/auth/login",
		jsonParser,
		passport.authenticate("local-login", {
			session: true,
			successRedirect: "/"
		})
	)

	app.put(
		"/api/auth/signup",
		jsonParser,
		passport.authenticate("local-signup", {
			session: true,
			successRedirect: "/"
		})
	)

	app.get("/api/auth/logout", (req, res) => {
		req.logout()
		res.redirect("/login")
	})
}

passportjs.verifySession = (req, res, next) => {
	// skip /login routes
	if (req.originalUrl.includes("/login")) {
		next()
	} else if (req.isAuthenticated && req.isAuthenticated()) {
		next()
		// redirect on browser routes; send Forbidden on api routes
	} else {
		req.originalUrl.includes("/api")
			? res.sendStatus(403)
			: res.redirect("/login")
	}
}

module.exports = passportjs
