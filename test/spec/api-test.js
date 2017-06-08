'use strict'
/* eslint-disable */

const app      = require('../../server/lib/app.js'),
      couchdb = require('../../server/lib/mci-couchdb.js'),
      request  = require('supertest'),
      should   = require('should'),
      login    = require('../lib/login.js')(request, app),
      axios    = require('axios'),
      dotenv   = require('dotenv')

require('should-http');
dotenv.config();

// Credentials for testing
// const TEST_USER = 'test';
// const TEST_PASS = 'test';

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

     it('POST /api/auth/login: rejects bad login', function (done) {
       request.agent(app)
        .post('/api/auth/login')
        .send({
          username: 'notareal@user.com',
          password: 'thisisapassword'
        })
        .expect(401)
        .end((err, res) => {
          res.status.should.equal(401);
          done();
        });
     });

     it('GET /api/auth/logout: logs out a logged-in user', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/auth/logout')
          .set('Cookie', cookie)
          .expect(302)
          .end((err, res) => {
            res.status.should.equal(302);
            res.headers.location.should.equal('/login');
            done();
          });
       });
     });

     it('GET /: redirects a user to /login if not logged in', function (done) {
       request.agent(app)
        .get('/')
        .expect(302)
        .end((err, res) => {
          res.status.should.equal(302);
          res.headers.location.should.equal('/login');
          done();
        });
     });

     it('GET /editor: redirects a user to /login if not logged in', function (done) {
       request.agent(app)
        .get('/editor')
        .expect(302)
        .end((err, res) => {
          res.status.should.equal(302);
          res.headers.location.should.equal('/login');
          done();
        });
     });

     it('GET /admin: redirects a user to /login if not logged in', function (done) {
       request.agent(app)
        .get('/admin')
        .expect(302)
        .end((err, res) => {
          res.status.should.equal(302);
          res.headers.location.should.equal('/login');
          done();
        });
     });

     it('GET /media: redirects a user to /login if not logged in', function (done) {
       request.agent(app)
        .get('/media')
        .expect(302)
        .end((err, res) => {
          res.status.should.equal(302);
          res.headers.location.should.equal('/login');
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

     it('GET /api/email/list: rejects a request with a non-numerical "skip" paramaeter', function (done) {
       login((agent, cookie) => {
         agent
          .get('/api/email/list/foo')
          .set('Cookie', cookie)
          .send({
            user: process.env.MCI_TEST_USER
          })
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
       });
     });

     it('GET /api/email/list: forbidden request if no cookie sent', function (done) {
       request.agent(app)
        .get('/api/email/list')
        .send({
          username: process.env.MCI_TEST_USER,
          password: process.env.MCI_TEST_PASS
        })
        .expect(403)
        .expect('Content-type', /application\/json/)
        .end((err, res) => {
          res.status.should.equal(403);
          done();
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

     it('GET /api/email/templates: forbidden request if no cookie passed', function (done) {
       request.agent(app)
        .get('/api/email/templates')
        .send({
          user: process.env.MCI_TEST_USER
        })
        .expect(403)
        .expect('Content-type', /application\/json/)
        .end((err, res) => {
          res.status.should.equal(403);
          done();
        });
     });

     it('GET /api/email/:id : fetches an email by id for a validated user', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       couchdb.createEmail(payload)
       .then(ack => {
         login((agent, cookie) => {
           agent
            .get(`/api/email/${ack.data.id}`)
            .send({
              user: process.env.MCI_TEST_USER
            })
            .set('Cookie', cookie)
            .expect(200)
            .expect('Content-type', /application\/json/)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.should.be.a.Object();
              res.body.contents.should.be.a.Array();
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     it('POST /api/email/create : creates an email for a validated user', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       login((agent, cookie) => {
         agent
          .post('/api/email/create')
          .send(payload)
          .set('Cookie', cookie)
          .expect(200)
          .expect('Content-type', /application\/json/)
          .end((err, res) => {
            res.status.should.equal(200);
            res.body.should.be.a.Object();
            res.body.contents.should.be.a.Array();
            done();
          });
       });
     });

     it('POST /api/email/create : rejects email creation if "contents" parameter is not passed', function (done) {
       login((agent, cookie) => {
         agent
          .post('/api/email/create')
          .send({
            title: 'Test Email'
          })
          .set('Cookie', cookie)
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
       });
     });

     it('POST /api/email/create : rejects email creation if "contents" parameter is not an array', function (done) {
       login((agent, cookie) => {
         agent
          .post('/api/email/create')
          .send({
            contents: {foo: 'bar'},
            title: 'Test Email'
          })
          .set('Cookie', cookie)
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
       });
     });

     it('POST /api/email/create : rejects email creation if "title" parameter is not passed', function (done) {
       const contents = [{
         content: '<p>Just start typing</p>',
         editorType: 'DefaultEditor',
         componentTitle: '',
         id: 'HypNy2Tbb'
       }]

       login((agent, cookie) => {
         agent
          .post('/api/email/create')
          .send({
            contents: contents
          })
          .set('Cookie', cookie)
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
       });
     });

     it('POST /api/email/create : rejects email creation if "title" parameter is not a string', function (done) {
       const contents = [{
         content: '<p>Just start typing</p>',
         editorType: 'DefaultEditor',
         componentTitle: '',
         id: 'HypNy2Tbb'
       }]

       login((agent, cookie) => {
         agent
          .post('/api/email/create')
          .send({
            contents: contents,
            title: {foo: 'bar'}
          })
          .set('Cookie', cookie)
          .expect(400)
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
       });
     });

     it('DELETE /api/email/delete : deletes a single email for a validated user', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       couchdb.createEmail(payload)
       .then(ack => {
         login((agent, cookie) => {
           agent
            .delete(`/api/email/delete`)
            .query({
              id: [ack.data.id]
            })
            .set('Cookie', cookie)
            .expect(200)
            .expect('Content-type', /application\/json/)
            .end((err, res) => {
              res.status.should.equal(200);
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     it('DELETE /api/email/delete : deletes multiple for a validated user', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       let first_id, second_id

       couchdb.createEmail(payload)
       .then(ack => {
         first_id = ack.data.id
         return couchdb.createEmail(payload)
       }).then(ack => {
         second_id = ack.data.id

         login((agent, cookie) => {
           agent
            .delete(`/api/email/delete`)
            .query({
              id: [first_id, second_id]
            })
            .set('Cookie', cookie)
            .expect(200)
            .expect('Content-type', /application\/json/)
            .end((err, res) => {
              res.status.should.equal(200);
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     it('DELETE /api/email/delete : deletes email even if "id" is a string (validator coerces single string to array with one item)', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       couchdb.createEmail(payload)
       .then(ack => {
         login((agent, cookie) => {
           agent
            .delete(`/api/email/delete`)
            .query({
              id: ack.data.id
            })
            .set('Cookie', cookie)
            .expect(200)
            .expect('Content-type', /application\/json/)
            .end((err, res) => {
              res.status.should.equal(200);
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     it('DELETE /api/email/delete : rejects deletion if "id" parameter is not present', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       couchdb.createEmail(payload)
       .then(ack => {
         login((agent, cookie) => {
           agent
            .delete(`/api/email/delete`)
            .set('Cookie', cookie)
            .expect(400)
            .end((err, res) => {
              res.status.should.equal(400);
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     it('POST /api/email/copy : duplicates an existing email for a validated user', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       couchdb.createEmail(payload)
       .then(ack => {
         login((agent, cookie) => {
           agent
            .post(`/api/email/copy`)
            .send({
              id: ack.data.id
            })
            .set('Cookie', cookie)
            .expect(200)
            .expect('Content-type', /application\/json/)
            .end((err, res) => {
              res.status.should.equal(200);
              res.body.title.should.equal(payload.title)
              res.body.contents[0].content.should.equal(payload.contents[0].content)
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     it('POST /api/email/copy : rejects email duplication if "id" parameter not present', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       couchdb.createEmail(payload)
       .then(ack => {
         login((agent, cookie) => {
           agent
            .post(`/api/email/copy`)
            .set('Cookie', cookie)
            .expect(400)
            .end((err, res) => {
              res.status.should.equal(400);
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     it('POST /api/email/copy : rejects email duplication if "id" parameter is not a string', function (done) {
       const payload = {
         contents: [{
           content: '<p>Just start typing</p>',
           editorType: 'DefaultEditor',
           componentTitle: '',
           id: 'HypNy2Tbb'
         }],
         title: 'Test Email',
         author: 'Ammar',
         email: 'amian@morningconsult.com'
       }

       couchdb.createEmail(payload)
       .then(ack => {
         login((agent, cookie) => {
           agent
            .post(`/api/email/copy`)
            .send({
              id: {foo: 'bar'}
            })
            .set('Cookie', cookie)
            .expect(400)
            .end((err, res) => {
              res.status.should.equal(400);
              done();
              return null;
            });
         });
       }).catch(err => {
         console.error(err);
         return null;
       });
     });

     // TODO: POST /compile, POST /search
   });



   /**
    * ---------------------------------------------------
    * S3 API TESTS
    * ---------------------------------------------------
    */

    describe('S3: /api/s3', function () {

      // TODO: GET /list/:grouping, GET /list/:skip?, POST /delete, POST /create,
    });




    /**
     * ---------------------------------------------------
     * META API TESTS
     * ---------------------------------------------------
     */

     describe('Meta: /api/meta', function () {

       // TODO: GET /loadConfig
     });
});
