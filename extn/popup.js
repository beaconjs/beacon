var load = function() {
    chrome.storage.local.get('beacon_auth', function(o){
        if(o.beacon_auth) {
            $('#logindiv').hide();
            $('#main').show();
        } else {
            $('#logindiv').show();
            $('#main').hide();
        }
    });
}

var capture = function() {
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
       console.log(image); //the image variable is a base64 encoded image which you should be able to load in either canvas or src attribute of an image.
       $("#main").append("<img src=\"" + image + "\" style=\"height:30em; width:auto;\"/>");
    });
}

var login = function() {
    $.post('http://localhost:3000/authenticate', { username: $("#username").val(), password: $("#password").val() }).done(function(res) {
        console.log(res);
        chrome.storage.local.set({'beacon_auth': $('#username').val() }, function() {
            load();
          });
    });
}

var logout = function() {
    chrome.storage.local.remove('beacon_auth', function() {
        $("#username").val("");
        $("#password").val("");
        load();
    });
}

$(document).ready(function() {
    $("#login").click(login);
    $("#logout").click(logout);
    $("#captureBtn").click(capture);
});

load();

