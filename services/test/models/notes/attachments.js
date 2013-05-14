var expect = require('chai').expect,
    should = require('chai').should();

var NoteAttachment = require('../../../models/notes/attachments').get;

var assert = require("assert")
describe('NoteAttachment', function(){
  describe('#save()', function(){
    it('should save an attachment', function(done){
        var attachment = new NoteAttachment(1, 'test.png');
        attachment.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#forNote()', function(){
    it('should get attachments for note', function(done){
        NoteAttachment.forNote(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#get()', function(){
    it('should fetch an attachment', function(done){
        NoteAttachment.get(1, 1, function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
