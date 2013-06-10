var load = function() {
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
       console.log(image); //the image variable is a base64 encoded image which you should be able to load in either canvas or src attribute of an image.
       document.write("<img src=\"" + image + "\" style=\"height:30em; width:auto;\"/>");
    });
}

load();

