'use strict'
/* eslint-disable */

const app      = require('../../server.js'),
      request  = require('supertest'),
      should   = require('should'),
      axios    = require('axios'),
      dotenv   = require('dotenv');

require('should-http');

/**
 * Define some global variables from environment
 *
 */

 dotenv.config();

// Credentials for testing
const TEST_USER = 'test';
const TEST_PASS = 'test';

const COUCH_URL = process.env.COUCHDB_URL // http://localhost:5984/
const COUCH_UUID = COUCH_URL + '_uuids' // http://localhost:5984/uuids
const COUCH_EMAILS = COUCH_URL + process.env.EMAIL_DB + '/' // http://localhost:5984/emails/
const COUCH_EMAILS_FIND = COUCH_EMAILS + '_find' // http://localhost:5984/emails/_find

/*

STEPS:

test user
- if test user -> delete user then create;
- if test user files -> delete all files;

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
  // Retry all tests in this suite up to 4 times
  this.retries(5);

  let server;

//   curl -X PUT $HOST/_config/admins/admin -d '"admin"'
// HOST=http://admin:admin@127.0.0.1:5984
// curl -X PUT $HOST/emails
// curl -X PUT $HOST/images

  before(function () {
    axios.put(COUCH_URL)
    server = app.listen(8888);
  });

  after(function (done) {
    server.close(done);
  });


  /**
   * ---------------------------------------------------
   * FILE API TESTS
   * ---------------------------------------------------
   */
   describe('Emails: /api/email', function () {
     it('GET /some-route: does stuff', function (done) {

     });
   });
     //
    //  it('GET /files: lists all user files', function (done) {
    //   login((agent, cookie) => {
    //     agent
    //       .get('/api/v1/users/files')
    //       .query({
    //         user: MCI_TEST_USER
    //       })
    //       .set('X-MCAPI-KEY', mcapi_key)
    //       .set('cookie', cookie)
    //       .expect(200)
    //       .expect('Content-type', /application\/json/)
    //       .end((err, res) => {
    //         res.status.should.equal(200);
    //         res.body.should.be.a.Array();
    //         done();
    //       });
    //   });
    //  });
});
