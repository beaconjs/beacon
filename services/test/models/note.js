var expect = require('chai').expect,
    should = require('chai').should();

var Note = require('../../models/note').get;

var assert = require("assert")
describe('Note', function(){
  describe('#save()', function(){
    it('should save a note', function(done){
        var note = new Note('test note', 'this is a test note');
        note.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
