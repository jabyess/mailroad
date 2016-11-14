# Builds emails better

### hopefully


### Development
* clone this repo
* `npm install`
* edit .env file with your database creds: PGUSER=username, PGDATABASE=dbname, PGPASSWORD=password
* `npm start` to start nodemon with babel hook
* `npm run dev` to start webpack and watcher
* navigate yourself to localhost:3000

#### Todo
* add clickable links to /email route
	* load data from db into corresponding number of editors
* ability to delete emails from /email
* get editor toolbars working & setup more editor definitions
* handlebars email template files
* user accounts and authentication (passport.js maybe?)
