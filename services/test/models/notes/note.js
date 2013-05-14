var expect = require('chai').expect,
    should = require('chai').should();

var Note = require('../../../models/notes/note').get;
var noteId = 1;

var assert = require("assert")
describe('Note', function(){
  describe('#save()', function(){
    it('should save a note', function(done){
        var note = new Note('test note', 'this is a test note', 1);
        note.save(function(o){
            expect(o.id).to.not.equal(null);
            noteId = o.id;
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#list()', function(){
    it('should list notes for a project', function(done){
        Note.all(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#get()', function(){
    it('should get note details for a project', function(done){
        Note.get(1, noteId, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

})
