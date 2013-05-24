var expect = require('chai').expect,
    should = require('chai').should();

var Bug = require('../../models/bugs').get;

var assert = require("assert")
describe('Bug', function(){
  describe('#save()', function(){
    it('should save a bug', function(done){
        var bug = new Bug('test', 'this is a test', 1, 1, "new", "high", 1);
        bug.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#all()', function(){
    it('should list all bugs', function(done){
        Bug.all(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#get()', function(){
    it('should fetch a bug', function(done){
        Bug.get(1, 1, function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
