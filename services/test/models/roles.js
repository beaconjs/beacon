var expect = require('chai').expect,
    should = require('chai').should();

var Role = require('../../models/roles').get;

var assert = require("assert")
describe('Role', function(){
  describe('#list()', function(){
    it('should list all roles', function(done){
        Role.list(function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    });
  });

})
