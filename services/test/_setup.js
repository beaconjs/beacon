var db = require('../db.js').sequelize;

var testData = [
"INSERT INTO projects (name, description) VALUES ('test', 'test description');",
"INSERT INTO roles (name) VALUES ('testadmin');",
"INSERT INTO users (name, user_name, password) VALUES ('test user', 'test', 'password');"
];

// now run the test data
testData.forEach(function(sql){
    db.query(sql).success(function(){ }).error(function(e){ console.log(e); });
});

console.log(">>>> starting tests...");
