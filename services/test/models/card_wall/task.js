var expect = require('chai').expect,
    should = require('chai').should();

var Task = require('../../../models/card_wall/task').get;

var assert = require("assert")
describe('Task', function(){
  describe('#save()', function(){
    it('should save a task', function(done){
        var task = new Task('test task', 1);
        task.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#list()', function(){
    it('should get tasks for a story', function(done){
        Task.list(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
