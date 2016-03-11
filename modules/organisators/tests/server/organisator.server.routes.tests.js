'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Organisator = mongoose.model('Organisator'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, organisator;

/**
 * Organisator routes tests
 */
describe('Organisator CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Organisator
    user.save(function () {
      organisator = {
        name: 'Organisator name'
      };

      done();
    });
  });

  it('should be able to save a Organisator if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Organisator
        agent.post('/api/organisators')
          .send(organisator)
          .expect(200)
          .end(function (organisatorSaveErr, organisatorSaveRes) {
            // Handle Organisator save error
            if (organisatorSaveErr) {
              return done(organisatorSaveErr);
            }

            // Get a list of Organisators
            agent.get('/api/organisators')
              .end(function (organisatorsGetErr, organisatorsGetRes) {
                // Handle Organisator save error
                if (organisatorsGetErr) {
                  return done(organisatorsGetErr);
                }

                // Get Organisators list
                var organisators = organisatorsGetRes.body;

                // Set assertions
                (organisators[0].user._id).should.equal(userId);
                (organisators[0].name).should.match('Organisator name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Organisator if not logged in', function (done) {
    agent.post('/api/organisators')
      .send(organisator)
      .expect(403)
      .end(function (organisatorSaveErr, organisatorSaveRes) {
        // Call the assertion callback
        done(organisatorSaveErr);
      });
  });

  it('should not be able to save an Organisator if no name is provided', function (done) {
    // Invalidate name field
    organisator.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Organisator
        agent.post('/api/organisators')
          .send(organisator)
          .expect(400)
          .end(function (organisatorSaveErr, organisatorSaveRes) {
            // Set message assertion
            (organisatorSaveRes.body.message).should.match('Please fill Organisator name');

            // Handle Organisator save error
            done(organisatorSaveErr);
          });
      });
  });

  it('should be able to update an Organisator if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Organisator
        agent.post('/api/organisators')
          .send(organisator)
          .expect(200)
          .end(function (organisatorSaveErr, organisatorSaveRes) {
            // Handle Organisator save error
            if (organisatorSaveErr) {
              return done(organisatorSaveErr);
            }

            // Update Organisator name
            organisator.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Organisator
            agent.put('/api/organisators/' + organisatorSaveRes.body._id)
              .send(organisator)
              .expect(200)
              .end(function (organisatorUpdateErr, organisatorUpdateRes) {
                // Handle Organisator update error
                if (organisatorUpdateErr) {
                  return done(organisatorUpdateErr);
                }

                // Set assertions
                (organisatorUpdateRes.body._id).should.equal(organisatorSaveRes.body._id);
                (organisatorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Organisators if not signed in', function (done) {
    // Create new Organisator model instance
    var organisatorObj = new Organisator(organisator);

    // Save the organisator
    organisatorObj.save(function () {
      // Request Organisators
      request(app).get('/api/organisators')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Organisator if not signed in', function (done) {
    // Create new Organisator model instance
    var organisatorObj = new Organisator(organisator);

    // Save the Organisator
    organisatorObj.save(function () {
      request(app).get('/api/organisators/' + organisatorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', organisator.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Organisator with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/organisators/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Organisator is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Organisator which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Organisator
    request(app).get('/api/organisators/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Organisator with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Organisator if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Organisator
        agent.post('/api/organisators')
          .send(organisator)
          .expect(200)
          .end(function (organisatorSaveErr, organisatorSaveRes) {
            // Handle Organisator save error
            if (organisatorSaveErr) {
              return done(organisatorSaveErr);
            }

            // Delete an existing Organisator
            agent.delete('/api/organisators/' + organisatorSaveRes.body._id)
              .send(organisator)
              .expect(200)
              .end(function (organisatorDeleteErr, organisatorDeleteRes) {
                // Handle organisator error error
                if (organisatorDeleteErr) {
                  return done(organisatorDeleteErr);
                }

                // Set assertions
                (organisatorDeleteRes.body._id).should.equal(organisatorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Organisator if not signed in', function (done) {
    // Set Organisator user
    organisator.user = user;

    // Create new Organisator model instance
    var organisatorObj = new Organisator(organisator);

    // Save the Organisator
    organisatorObj.save(function () {
      // Try deleting Organisator
      request(app).delete('/api/organisators/' + organisatorObj._id)
        .expect(403)
        .end(function (organisatorDeleteErr, organisatorDeleteRes) {
          // Set message assertion
          (organisatorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Organisator error error
          done(organisatorDeleteErr);
        });

    });
  });

  it('should be able to get a single Organisator that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Organisator
          agent.post('/api/organisators')
            .send(organisator)
            .expect(200)
            .end(function (organisatorSaveErr, organisatorSaveRes) {
              // Handle Organisator save error
              if (organisatorSaveErr) {
                return done(organisatorSaveErr);
              }

              // Set assertions on new Organisator
              (organisatorSaveRes.body.name).should.equal(organisator.name);
              should.exist(organisatorSaveRes.body.user);
              should.equal(organisatorSaveRes.body.user._id, orphanId);

              // force the Organisator to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Organisator
                    agent.get('/api/organisators/' + organisatorSaveRes.body._id)
                      .expect(200)
                      .end(function (organisatorInfoErr, organisatorInfoRes) {
                        // Handle Organisator error
                        if (organisatorInfoErr) {
                          return done(organisatorInfoErr);
                        }

                        // Set assertions
                        (organisatorInfoRes.body._id).should.equal(organisatorSaveRes.body._id);
                        (organisatorInfoRes.body.name).should.equal(organisator.name);
                        should.equal(organisatorInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Organisator.remove().exec(done);
    });
  });
});
