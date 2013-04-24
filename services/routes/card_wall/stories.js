var Story = require('../../models/card_wall/story').get;

/*
 * GET story listing.
 */

exports.list = function(req, res){
  Story.all( function(docs){
        res.render('card_wall/stories.jade', { 
            title: 'Card Wall',
            stories:docs
        });
    }, function(error) { 
        console.log(error); 
    });
};

exports.create = function(req, res){
    var s = req.body;
    var story = new Story(s.title, s.details, 1, 1, 1, null, null);
    story.save(function(){}, function(){});

    Story.all( function(docs){
        res.render('card_wall/stories.jade', { 
            title: 'Card Wall',
            stories:docs
        });
    }, function(error) { 
        console.log(error); 
    });
};