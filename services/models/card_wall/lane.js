var Lane = function(name, max_stories, stories) {
 this.name = name, 
 this.max_stories = max_stories, 
 this.stories = stories,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

exports=Lane;
