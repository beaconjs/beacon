var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function chat() {
    var date = new Date(); 
    var d = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' @ ' + date.getHours() + ':' + date.getMinutes();
    var msg = "";
    msg += $('#chatMsg').val();
    msg += ' <span>' + d + "</span>";
    $('.chat-box').append("<div class='chat-row'>" + msg + "</div>");
    $('div.chat-box').scrollTo('div.chat-row:last');
}