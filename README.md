# Builds emails better

### hopefully


### Development
* clone this repo
* `npm install`
* create a .env file in the root dir and include credentials (more TBD)
	* AWS_ACCESS_KEY_ID=xxxxxxx
	* AWS_SECRET_ACCESS_KEY=xxxxxx
	* AWS_REGION=region-east-x
	* AWS_BUCKET=bucket-name-here

* `npm start` to start nodemon with babel hook
* `npm run dev` to start webpack and watcher

### Layout
Code is divided into /client and /server folders. `client` contains react router code, jsx, sass, fonts, and some client side libs.
`server` contains the express code (api routes), email templates, server side libs, other logic.