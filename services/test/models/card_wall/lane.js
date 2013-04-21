var expect = require('chai').expect,
    should = require('chai').should();

var Lane = require('../../../models/card_wall/lane').get;

var assert = require("assert")
describe('Lane', function(){
  describe('#save()', function(){
    it('should save a lane', function(done){
        var lane = new Lane('test lane', 5, 'open');
        lane.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            console.log(error);
            done();
        });
    })
  })
})
