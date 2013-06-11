var base_url = "http://localhost:3000/";
var user_id = null;

var bug = {};

var screenshot = null;

var init = function() {
    chrome.storage.local.get(['beacon_auth', 'beacon_auth_id'], function(o){
        if(o.beacon_auth) {
            $('#logindiv').hide();
            $('#main').show();
            user_id = o.beacon_auth_id;
            loadProjects();
        } else {
            $('#logindiv').show();
            $('#main').hide();
        }
    });
}

var capture = function() {
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
       screenshot = image;
       $("#main").append("<img id='screenshot' src=\"" + image + "\" style=\"height:30em; width:auto;\"/>");
    });
}

var login = function() {
    $.post(base_url + 'authenticate', { username: $("#username").val(), password: $("#password").val() }).done(function(res) {
        if (res) {
            chrome.storage.local.set({'beacon_auth': $('#username').val(), 'beacon_auth_id': res.id }, function() {
                init();
            });
        }
    });
}

var loadProjects = function() {
    if (user_id) $.get(base_url + 'users/' + user_id + '/projects', function(res) {
        var options = $("#project");
        options.html("");
        if (res) {
            $.each(res, function() {
                options.append($("<option />").val(this.project.id).text(this.project.name));
            });

            loadOwners(res[0].id);
        }
    });
}

var loadOwners = function(project_id) {
    if (user_id) $.get(base_url + 'projects/' + project_id + '/members', function(res) {
        var options = $("#owner");
        options.html("");
        if (res) {
            $.each(res, function() {
                options.append($("<option />").val(this.user.id).text(this.user.name));
            });
        }
    });
}

var logout = function() {
    chrome.storage.local.remove(['beacon_auth', 'beacon_auth_id'], function() {
        $("#username").val("");
        $("#password").val("");
        init();
    });
}

var save = function() {
    bug = {
        title: $("#title").val(),
        details: $("#details").val(),
        priority: $("#priority").val(),
        owner_id: $("#owner").val(),
        status: 'New',
        user: user_id
    }
    project_id = $('#project').val();

    $.post(base_url + 'projects/' + project_id + '/bugs', bug).done(function(res){
        if (screenshot) {
            $.post(base_url + 'projects/' + project_id + '/bugs/' + res.id + '/screenshot', { screenshot: screenshot }).done(function(res){
            });
        }

        bug = {};
        screenshot = null;
        $('#screenshot').remove();
        $("#title").val("");
        $("#details").val("");
        $("#priority").val("");
        $("#owner").val("");
    });
}

$(document).ready(function() {
    $("#login").click(login);
    $("#logout").click(logout);
    $("#captureBtn").click(capture);
    $("#saveBtn").click(save);
});

init();

