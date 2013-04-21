var expect = require('chai').expect,
    should = require('chai').should();

var Epic = require('../../../models/card_wall/epic').get;

var assert = require("assert")
describe('Epic', function(){
  describe('#save()', function(){
    it('should save a epic', function(done){
        var epic = new Epic('test epic', 'this is a test epic', 'not_started');
        epic.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            console.log(error);
            done();
        });
    })
  })
})
