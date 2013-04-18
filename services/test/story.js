var Story = require('../models/card_wall/story');

var assert = require("assert")
describe('Story', function(){
  describe('#save()', function(){
    it('should save a story', function(){
        var story = new Story.Story('title', 'details', 1, 1, 1, null, null);
        Story.save(story);
        
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})
