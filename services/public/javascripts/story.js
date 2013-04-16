function addStory() {
    $("#fade").show();
    $("#newStory").show();
}

function closePopup() {
    $("#fade").hide();
    $("#newStory").hide();
    return false;
}

function openStory(id) {
    $("#storyTitle").val('test test');
    $("#storyDetails").val('test test test test test test test test test test');

    $("#fade").show();
    $("#newStory").show();
}