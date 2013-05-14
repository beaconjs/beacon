var expect = require('chai').expect,
    should = require('chai').should();

var Comment = require('../../../models/notes/comment').get;

var assert = require("assert")
describe('Comment', function(){
  describe('#save()', function(){
    it('should save a comment', function(done){
        var comment = new Comment('this is a test comment', 1, 1, 'note');
        comment.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#forNote()', function(){
    it('should get comments for note', function(done){
        Comment.forNote(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#get()', function(){
    it('should fetch a comment', function(done){
        Comment.get(1, function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
