process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../models/user');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () =>{
  before((done) => {
    User.remove({}, (err) => {
       done();
    });
  });
  describe('SIGNIN - Empty DB', () => {
    it('It should NOT signin, email doesnt exist', (done) => {
      var user = {
        email: "a@b.com",
        password: "12345"
      };
      chai.request(server)
          .post('/api/signin')
          .send(user)
          .end((err, res) => {
              res.should.have.status(401);
              res.body.success.should.be.eql(false);
              res.body.message.should.be.eql("Authentication failed. User not found!");
            done();
          });
    });
  });
  describe('SIGNUP', () => {
    it('It should signup', (done) => {
      var user = {
        name: 'Test',
        email: 'a@b.com',
        password: '12345'
      }
      chai.request(server)
          .post('/api/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.success.should.be.eql(true);
            res.body.user.should.have.property("_id");
            res.body.user.should.have.property("name").eql("Test");
            res.body.user.should.have.property("email").eql("a@b.com");
            res.body.user.should.have.property("isValidated").eql(false);
            res.body.user.should.have.property("hasPayed").eql(false);
            res.body.user.should.have.property("verificationCode").eql(null);
            done();
          });
    });
    it('It should NOT signup, email duplicated', (done) => {
      var user = {
        name: 'Test',
        email: 'a@b.com',
        password: '12345'
      }
      chai.request(server)
          .post('/api/signup')
          .send(user)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.success.should.be.eql(false);
            done();
          });
    });
  });
  describe('SIGNIN', () => {
    it('It should NOT signin, null password', (done) => {
    var user = {
      email: 'a@b.com',
      password: ''
    }
    chai.request(server)
      .post('/api/signin')
      .send(user)
      .end((err, res) => {
          res.should.have.status(401);
          res.body.success.should.be.eql(false);
          res.body.message.should.be.eql("Authentication failed. Incorrect password!");
        done();
      });
    });
    it('It should NOT signin, null email', (done) => {
      var user = {
        email: "",
        password: "12345"
      };
      chai.request(server)
        .post('/api/signin')
        .send(user)
        .end((err, res) => {
            res.should.have.status(401);
            res.body.success.should.be.eql(false);
            res.body.message.should.be.eql("Authentication failed. User not found!");
          done();
        });
    });
    it('It should NOT signin, wrong password', (done) => {
      var user = {
        email: "a@b.com",
        password: "123"
      };
      chai.request(server)
        .post('/api/signin')
        .send(user)
        .end((err, res) => {
            res.should.have.status(401);
            res.body.success.should.be.eql(false);
            res.body.message.should.be.eql("Authentication failed. Incorrect password!");
          done();
        });
    });
  });
});

