var expect = require('chai').expect,
    should = require('chai').should();

var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var assert = require("assert")
describe('DB', function(){
    it('should check db connection', function(done){
        db
        .query("select count(1) from users")
        .success(function(o){
            expect(o.length).to.not.equal(0);
            done();
        }).error(function(error) {
            done();
        });
  })
})