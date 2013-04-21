var expect = require('chai').expect,
    should = require('chai').should();

var Project = require('../../../models/card_wall/project').get;

var assert = require("assert")
describe('Project', function(){
  describe('#save()', function(){
    it('should save a project', function(done){
        var project = new Project('test project', 'this is a test project');
        project.save(function(o){
            expect(o.id).to.not.equal(null);
            done();
        }, function(error){
            console.log(error);
            done();
        });
    })
  })
})
