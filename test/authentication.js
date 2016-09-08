process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../models/user');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Authentication', () => {
    beforeEach((done) => {
        User.remove({}, (err) => { 
           done();         
        });     
    });

  describe('/POST signin', () => {
      it('It should NOT signin', (done) => {
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

});