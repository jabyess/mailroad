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
   * AUTH API TESTS
   * ---------------------------------------------------
   */

   describe('Auth: /api/auth', function () {
     it('POST /api/auth/login: logs in user', function (done) {
       request.agent(app)
        .post('/api/auth/login')
        .send({
          username: process.env.MCI_TEST_USER,
          password: process.env.MCI_TEST_PASS
        })
        .expect(302)
        .end((err, res) => {
          res.status.should.equal(302);
          res.headers.location.should.equal('/');
          done();
        });
     });
   });

  /**
   * ---------------------------------------------------
   * EMAIL API TESTS
   * ---------------------------------------------------
   */

   describe('Emails: /api/email', function () {

     // fetching emails


     it('GET /api/email/list: lists emails for validated user, default options', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/list')
          .set('Cookie', cookie)
          .send({
            user: process.env.MCI_TEST_USER
          })
          .expect(200)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.a.Object();
            res.body.rows.should.be.a.Array();
            done();
          });
       });
     });

     it('GET /api/email/list/:skip: lists emails for validated user, with a skip param passed', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/list/10')
          .set('Cookie', cookie)
          .send({
            user: process.env.MCI_TEST_USER
          })
          .expect(200)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.a.Object();
            res.body.rows.should.be.a.Array();
            done();
          });
       });
     });

     it('GET /api/email/list: lists emails for validated user', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/list')
          .set('Cookie', cookie)
          .send({
            user: process.env.MCI_TEST_USER
          })
          .expect(200)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.a.Object();
            res.body.rows.should.be.a.Array();
            done();
          });
       });
     });

     it('GET /api/email/list: bad request if no user parameter sent', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/list')
          .set('Cookie', cookie)
          .expect(400)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
       });
     });

     it('GET /api/email/list: forbidden request if the user sent in request does not match logged in user', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/list')
          .send({
            user: 'not_the_logged_in_user'
          })
          .set('Cookie', cookie)
          .expect(403)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(403);
            res.text.should.equal('Forbidden');
            done();
          });
       });
     });



     // fetching templates


     it('GET /api/email/templates: lists available templates for validated user', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/templates')
          .send({
            user: process.env.MCI_TEST_USER
          })
          .set('Cookie', cookie)
          .expect(200)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.a.Array();
            done();
          });
       });
     });

     it('GET /api/email/templates: bad request if no user parameter sent', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/templates')
          .set('Cookie', cookie)
          .expect(400)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
       });
     });

     it('GET /api/email/templates: forbidden request if the user sent in request does not match logged in user', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/templates')
          .send({
            user: 'not_the_logged_in_user'
          })
          .set('Cookie', cookie)
          .expect(403)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(403);
            res.text.should.equal('Forbidden');
            done();
          });
       });
     });


     // TODO: GET /:id, POST /compile, POST /create, DELETE /delete, POST /search, POST /copy
     
   });
});
