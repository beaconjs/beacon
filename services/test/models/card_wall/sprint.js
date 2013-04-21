var expect = require('chai').expect,
    should = require('chai').should();

var Sprint = require('../../../models/card_wall/sprint').get;

var assert = require("assert")
describe('Sprint', function(){
  describe('#save()', function(){
    it('should save a sprint', function(done){
        var sprint = new Sprint('test sprint');
        sprint.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
