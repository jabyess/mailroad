# MailRoad

## builds emails better, hopefully.

### Development
* clone this repo
* `npm install`
* copy .env.sample into a newly created .env file, change values as necessary. Recommended: leave the database names alone for now.
* `npm run sync-views` to upload design docs to appropriate databases.
* Once you set it all up, start everything.
* `redis-server` to start redis
* `npm start` to start nodemon with babel hook
* `npm run dev` to start webpack and watcher and open browser to `localhost:8888`

### Layout
Code is divided into /client and /server folders. `client` contains react router code, jsx, sass, fonts, and some client side libs.
`server` contains the express code (api routes), email templates, server side libs, other logic.