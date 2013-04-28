function formatText(command, value) {
    value = value || null;
    document.execCommand(command,false,value);
}

var _fileTypeImage = false;
var _filePath = null;

function attachFile(insert) {
    _fileTypeImage = insert;
    $('#notedetails-dropzone-container').show();
    var notesDropzone = Dropzone.forElement("#notedetails-dropzone-form");
    notesDropzone.on("addedfile", function(file) {
      _filePath = '/uploaded/' + file.name;
    });
}

function insertTable() {
    var rows = prompt("Rows");
    var cols = prompt("Columns");

    var table = "<table>";
    for (var r=0; r<rows; r++) {
        var tr = "<tr>";
        for (var c=0; c<cols; c++) {
            tr += "<td></td>";
        }
        tr += "</tr>";
        table += tr;
    }

    table += "</table>";

    $('#notedetails_div').append(table);
}

function closeDropZone() {
    $('#notedetails-dropzone-container').hide();
    if (_fileTypeImage) formatText('InsertImage', _filePath);
}

(function setTextValue() {
    $('#notedetails').val($('#notedetails_div').html());
    $('#notedetails-msg').html("Autosaved at " + (new Date()));
    window.setTimeout(setTextValue, 30000);
})();
