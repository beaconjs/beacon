var expect = require('chai').expect,
    should = require('chai').should();

var Chat = require('../../../models/history/chat').get;

var assert = require("assert")
describe('Chat', function(){
  describe('#save()', function(){
    it('should save a chat', function(done){
        var chat = new Chat('test test', "proj1", "admin");
        chat.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#list()', function(){
    it('should list all the chats', function(done){
        Chat.all("proj1", 0, 0, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })

    it('should list a fixed number of the chats', function(done){
        Chat.all("proj1", 0, 10, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
