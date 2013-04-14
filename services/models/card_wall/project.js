
var Project = function(name, backlog) {
 this.name = name, 
 this.backlog = backlog,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

exports=Project;
