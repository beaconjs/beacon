var expect = require('chai').expect,
    should = require('chai').should();
var crypto = require('crypto');

var User = require('../../models/users').get;

var assert = require("assert")
describe('User', function(){
  describe('#save()', function(){
    it('should save a users', function(done){
        var users = new User('test user', 'username', 'password');
        users.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    });
  });

  describe('#find()', function(){
    it('should find a user', function(done){
        var shasum = crypto.createHash('sha512');
        shasum.update('password');
        var password = shasum.digest('hex');

        User.find('username', password, function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    });
  });

  describe('#lookup()', function(){
    it('should find a user', function(done){
        User.lookup('test', function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    });
  });


})
