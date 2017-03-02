# MailRoad

## builds emails better, hopefully.

### Development
* clone this repo
* `npm install`
* copy .env.sample into a newly created .env file, change values as necessary
* for now, database migrations must be done manually. create database tables and design documents/views using CouchDB admin UI. Tables should have the same names as what you put in the .env file. Design docs are stored in `/server/couchdb-views`. 
	* Each design document contains one view, and they both should have the same name as the file in the folder.
	* First word in the design doc corresponds to the table it should be created in: e.g. `EmailsByUpdatedDate.js` goes in `emails` table.
	* End result is you should be hitting a url like `url:5984/_design/EmailsByUpdatedDate/_view/EmailsByUpdatedDate`. See [CouchDB docs](http://docs.couchdb.org/en/2.0.0/api/ddoc/views.html) for more info.
* Once you set it all up, start everything.
* `redis-server` to start redis
* `npm start` to start nodemon with babel hook
* `npm run dev` to start webpack and watcher and open browser to `localhost:8888`

### Layout
Code is divided into /client and /server folders. `client` contains react router code, jsx, sass, fonts, and some client side libs.
`server` contains the express code (api routes), email templates, server side libs, other logic.