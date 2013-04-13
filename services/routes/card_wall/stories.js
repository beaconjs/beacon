var StoryProvider = require('../../card_wall/stories').StoryProvider;

var storyProvider= new StoryProvider();

/*
 * GET story listing.
 */

exports.list = function(req, res){
  storyProvider.findAll( function(error,docs){
        res.render('card_wall/stories.jade', { 
            title: 'Card Wall',
            stories:docs
        });
    })
};

exports.create = function(req, res){
    var s = req.body;
    storyProvider.save(s, function(){});

  storyProvider.findAll( function(error,docs){
        res.render('card_wall/stories.jade', { 
            title: 'Card Wall',
            stories:docs
        });
    })
};