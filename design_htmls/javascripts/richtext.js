function formatText(command, value) {
    value = value || null;
    document.execCommand(command,false,value);
}

(function setTextValue() {
    $('#notedetails').val($('#notedetails_div').html());
    $('#notedetails-msg').html("Autosaved at " + (new Date()));
    window.setTimeout(setTextValue, 30000);
})();
