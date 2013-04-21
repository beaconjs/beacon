var expect = require('chai').expect,
    should = require('chai').should();

var Task = require('../../../models/card_wall/task').get;

var assert = require("assert")
describe('Task', function(){
  describe('#save()', function(){
    it('should save a task', function(done){
        var task = new Task('test task');
        task.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
