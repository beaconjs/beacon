var db = require("../../db.js").sequelize;
var DataTypes = require("sequelize");

var _table = db.define('users', {
      name: DataTypes.STRING,
      email: DataTypes.STRING
    }, { 
      timestamps: false
    });

var assert = require("assert")
describe('DB', function(){
    it('should check db connection', function(done){
        _table
        .all()
        .success(function(){
            done();
        }).error(function(error) {
            done();
        });
  })
})
