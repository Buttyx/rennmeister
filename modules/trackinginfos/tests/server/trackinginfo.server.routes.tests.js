'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Trackinginfo = mongoose.model('Trackinginfo'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, trackinginfo;

/**
 * Trackinginfo routes tests
 */
describe('Trackinginfo CRUD tests', function () {

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

    // Save a user to the test db and create new Trackinginfo
    user.save(function () {
      trackinginfo = {
        name: 'Trackinginfo name'
      };

      done();
    });
  });

  it('should be able to save a Trackinginfo if logged in', function (done) {
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

        // Save a new Trackinginfo
        agent.post('/api/trackinginfos')
          .send(trackinginfo)
          .expect(200)
          .end(function (trackinginfoSaveErr, trackinginfoSaveRes) {
            // Handle Trackinginfo save error
            if (trackinginfoSaveErr) {
              return done(trackinginfoSaveErr);
            }

            // Get a list of Trackinginfos
            agent.get('/api/trackinginfos')
              .end(function (trackinginfosGetErr, trackinginfosGetRes) {
                // Handle Trackinginfo save error
                if (trackinginfosGetErr) {
                  return done(trackinginfosGetErr);
                }

                // Get Trackinginfos list
                var trackinginfos = trackinginfosGetRes.body;

                // Set assertions
                (trackinginfos[0].user._id).should.equal(userId);
                (trackinginfos[0].name).should.match('Trackinginfo name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Trackinginfo if not logged in', function (done) {
    agent.post('/api/trackinginfos')
      .send(trackinginfo)
      .expect(403)
      .end(function (trackinginfoSaveErr, trackinginfoSaveRes) {
        // Call the assertion callback
        done(trackinginfoSaveErr);
      });
  });

  it('should not be able to save an Trackinginfo if no name is provided', function (done) {
    // Invalidate name field
    trackinginfo.name = '';

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

        // Save a new Trackinginfo
        agent.post('/api/trackinginfos')
          .send(trackinginfo)
          .expect(400)
          .end(function (trackinginfoSaveErr, trackinginfoSaveRes) {
            // Set message assertion
            (trackinginfoSaveRes.body.message).should.match('Please fill Trackinginfo name');

            // Handle Trackinginfo save error
            done(trackinginfoSaveErr);
          });
      });
  });

  it('should be able to update an Trackinginfo if signed in', function (done) {
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

        // Save a new Trackinginfo
        agent.post('/api/trackinginfos')
          .send(trackinginfo)
          .expect(200)
          .end(function (trackinginfoSaveErr, trackinginfoSaveRes) {
            // Handle Trackinginfo save error
            if (trackinginfoSaveErr) {
              return done(trackinginfoSaveErr);
            }

            // Update Trackinginfo name
            trackinginfo.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Trackinginfo
            agent.put('/api/trackinginfos/' + trackinginfoSaveRes.body._id)
              .send(trackinginfo)
              .expect(200)
              .end(function (trackinginfoUpdateErr, trackinginfoUpdateRes) {
                // Handle Trackinginfo update error
                if (trackinginfoUpdateErr) {
                  return done(trackinginfoUpdateErr);
                }

                // Set assertions
                (trackinginfoUpdateRes.body._id).should.equal(trackinginfoSaveRes.body._id);
                (trackinginfoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Trackinginfos if not signed in', function (done) {
    // Create new Trackinginfo model instance
    var trackinginfoObj = new Trackinginfo(trackinginfo);

    // Save the trackinginfo
    trackinginfoObj.save(function () {
      // Request Trackinginfos
      request(app).get('/api/trackinginfos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Trackinginfo if not signed in', function (done) {
    // Create new Trackinginfo model instance
    var trackinginfoObj = new Trackinginfo(trackinginfo);

    // Save the Trackinginfo
    trackinginfoObj.save(function () {
      request(app).get('/api/trackinginfos/' + trackinginfoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', trackinginfo.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Trackinginfo with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/trackinginfos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Trackinginfo is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Trackinginfo which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Trackinginfo
    request(app).get('/api/trackinginfos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Trackinginfo with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Trackinginfo if signed in', function (done) {
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

        // Save a new Trackinginfo
        agent.post('/api/trackinginfos')
          .send(trackinginfo)
          .expect(200)
          .end(function (trackinginfoSaveErr, trackinginfoSaveRes) {
            // Handle Trackinginfo save error
            if (trackinginfoSaveErr) {
              return done(trackinginfoSaveErr);
            }

            // Delete an existing Trackinginfo
            agent.delete('/api/trackinginfos/' + trackinginfoSaveRes.body._id)
              .send(trackinginfo)
              .expect(200)
              .end(function (trackinginfoDeleteErr, trackinginfoDeleteRes) {
                // Handle trackinginfo error error
                if (trackinginfoDeleteErr) {
                  return done(trackinginfoDeleteErr);
                }

                // Set assertions
                (trackinginfoDeleteRes.body._id).should.equal(trackinginfoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Trackinginfo if not signed in', function (done) {
    // Set Trackinginfo user
    trackinginfo.user = user;

    // Create new Trackinginfo model instance
    var trackinginfoObj = new Trackinginfo(trackinginfo);

    // Save the Trackinginfo
    trackinginfoObj.save(function () {
      // Try deleting Trackinginfo
      request(app).delete('/api/trackinginfos/' + trackinginfoObj._id)
        .expect(403)
        .end(function (trackinginfoDeleteErr, trackinginfoDeleteRes) {
          // Set message assertion
          (trackinginfoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Trackinginfo error error
          done(trackinginfoDeleteErr);
        });

    });
  });

  it('should be able to get a single Trackinginfo that has an orphaned user reference', function (done) {
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

          // Save a new Trackinginfo
          agent.post('/api/trackinginfos')
            .send(trackinginfo)
            .expect(200)
            .end(function (trackinginfoSaveErr, trackinginfoSaveRes) {
              // Handle Trackinginfo save error
              if (trackinginfoSaveErr) {
                return done(trackinginfoSaveErr);
              }

              // Set assertions on new Trackinginfo
              (trackinginfoSaveRes.body.name).should.equal(trackinginfo.name);
              should.exist(trackinginfoSaveRes.body.user);
              should.equal(trackinginfoSaveRes.body.user._id, orphanId);

              // force the Trackinginfo to have an orphaned user reference
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

                    // Get the Trackinginfo
                    agent.get('/api/trackinginfos/' + trackinginfoSaveRes.body._id)
                      .expect(200)
                      .end(function (trackinginfoInfoErr, trackinginfoInfoRes) {
                        // Handle Trackinginfo error
                        if (trackinginfoInfoErr) {
                          return done(trackinginfoInfoErr);
                        }

                        // Set assertions
                        (trackinginfoInfoRes.body._id).should.equal(trackinginfoSaveRes.body._id);
                        (trackinginfoInfoRes.body.name).should.equal(trackinginfo.name);
                        should.equal(trackinginfoInfoRes.body.user, undefined);

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
      Trackinginfo.remove().exec(done);
    });
  });
});
