# MailRoad

## builds emails better, hopefully.

### Development
* install couchdb version 2 or newer
* clone this repo
* `npm install`
* copy .env.sample into a newly created .env file, change values as necessary. Recommended: leave the database names alone for now.
* start couchdb-server
* `npm run sync-views` to upload design docs to appropriate databases.
* Once you set it all up, start everything.
* `redis-server` to start redis
* `npm run develop` to start nodemon & express
* `npm run webpack` to start webpack and watcher and open browser to `localhost:8888`


### Self-Signing SSL Certs for Local Development

```bash
cd <parent-dir>/mailroad/server/ssl
```

then follow the instructions here:
https://matoski.com/article/node-express-generate-ssl/

### Layout
Code is divided into /client and /server folders. `client` contains react router code, jsx, sass, fonts, and some client side libs.
`server` contains the express code (api routes), email templates, server side libs, other logic.
