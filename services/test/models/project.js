var expect = require('chai').expect,
    should = require('chai').should();

var Project = require('../../models/project').get;

var assert = require("assert")
describe('Project', function(){
  describe('#save()', function(){
    it('should save a project', function(done){
        var project = new Project('test project', 'this is a test project');
        project.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#all()', function(){
    it('should list all projects', function(done){
        Project.all(function(o){
            expect(o.length).to.not.equal(0);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })

  describe('#get()', function(){
    it('should fetch a project', function(done){
        Project.get(1, function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            done();
            if (error) throw error;
        });
    })
  })
})
