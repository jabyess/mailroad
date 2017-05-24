'use strict'
/* eslint-disable */

const app      = require('../../server/lib/app.js'),
      request  = require('supertest'),
      should   = require('should'),
      login    = require('../lib/login.js')(request, app),
      axios    = require('axios'),
      dotenv   = require('dotenv');

require('should-http');
dotenv.config();

// Credentials for testing
// const TEST_USER = 'test';
// const TEST_PASS = 'test';

const COUCH_URL = process.env.COUCHDB_URL // http://localhost:5984/
const COUCH_UUID = COUCH_URL + '_uuids' // http://localhost:5984/uuids
const COUCH_EMAILS = COUCH_URL + process.env.EMAIL_DB + '/' // http://localhost:5984/emails/
const COUCH_EMAILS_FIND = COUCH_EMAILS + '_find' // http://localhost:5984/emails/_find

/*

endpoints to test:

/api
  /emails
    - valid credentials and parameters
    - crud operations on emails
  /s3
    - valid credentials and parameters
    - crud operations on images
  /meta
    - valid credentials and parameters
    - crud operations on meta stuff
  /auth
    - passportjs
    - authentication/authorization/sign-in/logout/verification


goal:

this test suite makes sure that any errors that we hit are thereafter
tested for -- means subsequent errors of the same type means there's
a clientside issue, not serverside (most likely)

*/








/**
 * ------------------------------------------------------
 *
 * MAILROAD API TESTS
 *
 * ------------------------------------------------------
 */

describe('Mailroad API: /api/*', function () {
  this.retries(5);
  let server;

  before(function () {
    server = app.listen(8888);
  });

  after(function (done) {
    server.close(done);
  });

  /**
   * ---------------------------------------------------
   * EMAIL API TESTS
   * ---------------------------------------------------
   */

   describe('Emails: /api/email', function () {
     it('GET /api/email/list: lists emails', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/list')
          .set('cookie', cookie)
          .expect(200)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.a.Array();
            done();
          })
       })
     });
   });
});
