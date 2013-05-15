var expect = require('chai').expect,
    should = require('chai').should();

var Sprint = require('../../../models/card_wall/sprint').get;

var assert = require("assert")
describe('Sprint', function(){
  describe('#save()', function(){
    it('should save a sprint', function(done){
        var start = new Date();
        start.setDate(start.getDate() - 1);
        var end = new Date();
        end.setDate(end.getDate() + 1);

        var sprint = new Sprint('test sprint', 1, start, end);
        sprint.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#list()', function(){
    it('should list all sprints', function(done){
        Sprint.list(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#current()', function(){
    it('should get the current sprint', function(done){
        Sprint.current(1, function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

})
