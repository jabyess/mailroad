# MailRoad

## builds emails better, hopefully.
Mailroad helps you compose, write, and send emails through the ESP (email service provider) of your choice. It uses react, node, express, and couchdb

The frontend for mailroad has been [moved to its own repo](https://github.com/jabyess/mailroad-frontend/).

### Development

#### Dependencies
* CouchDB >= v2.0
* redis-server
* nodeJS >= v8.0
* an Amazon S3 bucket and API key

#### Installation
* Ensure external dependencies are installed and running
* clone this repo
* `cd` to the cloned directory and run `npm install`
* copy `.env.sample` into a new file `.env`. Add the appropriate API keys for AWS.
* start couchdb-server
* `npm run seed` to create databases and meta info
* `npm run sync-views` to upload design docs to appropriate databases.
* Once you set it all up, start everything.
* `redis-server` to start redis
* `npm run develop` to start nodemon & express

Don't forget to run the frontend as well!

### Layout
Code is divided into /client and /server folders. `client` contains react router code, jsx, sass, fonts, and some client side libs.
`server` contains the express code (api routes), email templates, server side libs, other logic.
