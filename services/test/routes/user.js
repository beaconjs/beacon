var expect = require('chai').expect,
    should = require('chai').should();

var User = require('../../routes/user');
var mockHttp = require('./mock');

var assert = require("assert")
describe('User', function(){
  describe('#authenticate()', function(){
    it('should authenticate a user', function(done){
        var req = {username: 'test', password: 'password'};
        mockHttp({}, req, User.authenticate, 
            function(user) {
              expect(user.name).to.equal('test user');
              done();
            }, 
            done);
    })
  })

  describe('#lookup()', function(){
    it('should lookup a user', function(done){
        mockHttp({name: 'test'}, {}, User.lookup, 
            function(users) {
              expect(users.length).to.not.equal(0);
              done();
            },
            done);
    })
  })
})
