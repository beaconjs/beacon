var storyCounter = 1;

StoryProvider = function(){};
StoryProvider.prototype.dummyData = [];

StoryProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

StoryProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

StoryProvider.prototype.save = function(stories, callback) {
  var story = null;

  if( typeof(stories.length)=="undefined")
    stories = [stories];

  for( var i =0;i< stories.length;i++ ) {
    story = stories[i];
    story._id = storyCounter++;
    story.created_at = new Date();

    if( story.comments === undefined )
      story.comments = [];

    for(var j =0;j< story.comments.length; j++) {
      story.comments[j].created_at = new Date();
    }
    this.dummyData[this.dummyData.length]= story;
  }
  callback(null, stories);
};

/* Lets bootstrap with dummy data */
new StoryProvider().save([
  {title: 'Card one', text: 'This is a story'},
  {title: 'Card two', body: 'This is the story two'},
  {title: 'Card three', body: 'This is the story three'}
], function(error, stories){});

exports.StoryProvider = StoryProvider;

