var expect = require('chai').expect,
    should = require('chai').should();

var Story = require('../../../models/card_wall/story').get;

var assert = require("assert")
describe('Story', function(){
  describe('#save()', function(){
    it('should save a story', function(done){
        var story = new Story('title', 'details', 1, 1, 1, 1, null, null);
        story.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#update()', function(){
      it('should update a story', function(done){
        var story = new Story('title111', 'details', 1, 1, 1, 1, null, null);
        story.id = 1;
        story.update(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#forEpic()', function(){
    it('should get all stories for epic', function(done){
        Story.forEpic(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#list()', function(){
    it('should all stories for project', function(done){
        Story.list(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
