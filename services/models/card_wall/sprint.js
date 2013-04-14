var Sprint = function(name, stories, startDate, endDate) {
 this.name = name, 
 this.stories = stories, 
 this.startDate = startDate, 
 this.endDate = endDate,
 this.created_at = new Date(),
 this.modified_at = new Date();
};

exports=Sprint;
