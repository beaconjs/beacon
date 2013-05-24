var expect = require('chai').expect,
    should = require('chai').should();

var Todo = require('../../models/todos').get;

var assert = require("assert")
describe('Todo', function(){
  describe('#save()', function(){
    it('should save a todo', function(done){
        var todo = new Todo('test', 'this is a test', 1, 1, "new", 1);
        todo.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#all()', function(){
    it('should list all todos', function(done){
        Todo.all(1, function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#get()', function(){
    it('should fetch a todo', function(done){
        Todo.get(1, 1, function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
