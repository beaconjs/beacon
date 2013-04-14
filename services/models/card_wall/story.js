var Story = function(title, details, owner, points, sprint, tasks, comments) {
    this.title = title, 
    this.details = details, 
    this.owner = owner, 
    this.points = points, 
    this.sprint = sprint || -1, 
    this.status = 'not_started', 
    this.tasks = tasks, 
    this.comments = comments,
    this.created_at = new Date(), 
    this.modified_at = new Date();
};

exports = Story