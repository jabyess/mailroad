'use strict'
/* eslint-disable */


/**
 * Create a login function
 *
 * @param {Object} request
 *    The request module to use (i.e. superagent).
 * @param {Object} app
 *    The server application.
 *
 * @return {Function}
 */

module.exports = function initLogin (request, app) {
  return function login (done) {
    const agent = request.agent(app);

    agent.get('/').end((err, res) => {
      agent
        .post('/api/auth/login')
        .send({
          username: process.env.MCI_TEST_USER,
          password: process.env.MCI_TEST_PASS
        })
        .expect(302)
        .end((err, res) => {
          res.status.should.equal(302);
          done(agent, res.headers['set-cookie']);
        });
      });
  };
};
