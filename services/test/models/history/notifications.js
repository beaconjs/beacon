var expect = require('chai').expect,
    should = require('chai').should();

var Notification = require('../../../models/history/notifications').get;

var assert = require("assert")
describe('Notification', function(){
  describe('#save()', function(){
    it('should save a notification', function(done){
        var notification = new Notification('test test', 1, 1);
        notification.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#list()', function(){
    it('should list the notifications', function(done){
        Notification.all(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
