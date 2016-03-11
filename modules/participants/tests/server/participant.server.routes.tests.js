'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Participant = mongoose.model('Participant'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, participant;

/**
 * Participant routes tests
 */
describe('Participant CRUD tests', function () {

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

    // Save a user to the test db and create new Participant
    user.save(function () {
      participant = {
        name: 'Participant name'
      };

      done();
    });
  });

  it('should be able to save a Participant if logged in', function (done) {
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

        // Save a new Participant
        agent.post('/api/participants')
          .send(participant)
          .expect(200)
          .end(function (participantSaveErr, participantSaveRes) {
            // Handle Participant save error
            if (participantSaveErr) {
              return done(participantSaveErr);
            }

            // Get a list of Participants
            agent.get('/api/participants')
              .end(function (participantsGetErr, participantsGetRes) {
                // Handle Participant save error
                if (participantsGetErr) {
                  return done(participantsGetErr);
                }

                // Get Participants list
                var participants = participantsGetRes.body;

                // Set assertions
                (participants[0].user._id).should.equal(userId);
                (participants[0].name).should.match('Participant name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Participant if not logged in', function (done) {
    agent.post('/api/participants')
      .send(participant)
      .expect(403)
      .end(function (participantSaveErr, participantSaveRes) {
        // Call the assertion callback
        done(participantSaveErr);
      });
  });

  it('should not be able to save an Participant if no name is provided', function (done) {
    // Invalidate name field
    participant.name = '';

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

        // Save a new Participant
        agent.post('/api/participants')
          .send(participant)
          .expect(400)
          .end(function (participantSaveErr, participantSaveRes) {
            // Set message assertion
            (participantSaveRes.body.message).should.match('Please fill Participant name');

            // Handle Participant save error
            done(participantSaveErr);
          });
      });
  });

  it('should be able to update an Participant if signed in', function (done) {
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

        // Save a new Participant
        agent.post('/api/participants')
          .send(participant)
          .expect(200)
          .end(function (participantSaveErr, participantSaveRes) {
            // Handle Participant save error
            if (participantSaveErr) {
              return done(participantSaveErr);
            }

            // Update Participant name
            participant.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Participant
            agent.put('/api/participants/' + participantSaveRes.body._id)
              .send(participant)
              .expect(200)
              .end(function (participantUpdateErr, participantUpdateRes) {
                // Handle Participant update error
                if (participantUpdateErr) {
                  return done(participantUpdateErr);
                }

                // Set assertions
                (participantUpdateRes.body._id).should.equal(participantSaveRes.body._id);
                (participantUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Participants if not signed in', function (done) {
    // Create new Participant model instance
    var participantObj = new Participant(participant);

    // Save the participant
    participantObj.save(function () {
      // Request Participants
      request(app).get('/api/participants')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Participant if not signed in', function (done) {
    // Create new Participant model instance
    var participantObj = new Participant(participant);

    // Save the Participant
    participantObj.save(function () {
      request(app).get('/api/participants/' + participantObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', participant.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Participant with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/participants/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Participant is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Participant which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Participant
    request(app).get('/api/participants/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Participant with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Participant if signed in', function (done) {
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

        // Save a new Participant
        agent.post('/api/participants')
          .send(participant)
          .expect(200)
          .end(function (participantSaveErr, participantSaveRes) {
            // Handle Participant save error
            if (participantSaveErr) {
              return done(participantSaveErr);
            }

            // Delete an existing Participant
            agent.delete('/api/participants/' + participantSaveRes.body._id)
              .send(participant)
              .expect(200)
              .end(function (participantDeleteErr, participantDeleteRes) {
                // Handle participant error error
                if (participantDeleteErr) {
                  return done(participantDeleteErr);
                }

                // Set assertions
                (participantDeleteRes.body._id).should.equal(participantSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Participant if not signed in', function (done) {
    // Set Participant user
    participant.user = user;

    // Create new Participant model instance
    var participantObj = new Participant(participant);

    // Save the Participant
    participantObj.save(function () {
      // Try deleting Participant
      request(app).delete('/api/participants/' + participantObj._id)
        .expect(403)
        .end(function (participantDeleteErr, participantDeleteRes) {
          // Set message assertion
          (participantDeleteRes.body.message).should.match('User is not authorized');

          // Handle Participant error error
          done(participantDeleteErr);
        });

    });
  });

  it('should be able to get a single Participant that has an orphaned user reference', function (done) {
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

          // Save a new Participant
          agent.post('/api/participants')
            .send(participant)
            .expect(200)
            .end(function (participantSaveErr, participantSaveRes) {
              // Handle Participant save error
              if (participantSaveErr) {
                return done(participantSaveErr);
              }

              // Set assertions on new Participant
              (participantSaveRes.body.name).should.equal(participant.name);
              should.exist(participantSaveRes.body.user);
              should.equal(participantSaveRes.body.user._id, orphanId);

              // force the Participant to have an orphaned user reference
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

                    // Get the Participant
                    agent.get('/api/participants/' + participantSaveRes.body._id)
                      .expect(200)
                      .end(function (participantInfoErr, participantInfoRes) {
                        // Handle Participant error
                        if (participantInfoErr) {
                          return done(participantInfoErr);
                        }

                        // Set assertions
                        (participantInfoRes.body._id).should.equal(participantSaveRes.body._id);
                        (participantInfoRes.body.name).should.equal(participant.name);
                        should.equal(participantInfoRes.body.user, undefined);

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
      Participant.remove().exec(done);
    });
  });
});
