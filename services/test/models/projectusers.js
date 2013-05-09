var expect = require('chai').expect,
    should = require('chai').should();

var ProjectUser = require('../../models/projectusers').get;

var assert = require("assert")
describe('ProjectUser', function(){
  describe('#save()', function(){
    it('should save a projectuser', function(done){
        var projectuser = new ProjectUser(1,1,1);
        projectuser.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#list()', function(){
    it('should list all users for a project', function(done){
        ProjectUser.list(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

})
