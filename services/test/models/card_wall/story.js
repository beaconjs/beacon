var expect = require('chai').expect,
    should = require('chai').should();

var Story = require('../../../models/card_wall/story').get;

var assert = require("assert")
describe('Story', function(){
  describe('#save()', function(){
    it('should save a story', function(done){
        var story = new Story('title', 'details', 1, 1, 1, null, null);
        story.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
