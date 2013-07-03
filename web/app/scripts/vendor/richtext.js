function formatText(command, value) {
    value = value || null;
    document.execCommand(command,false,value);
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

(function setTextValue() {
    $('#notedetails').val($('#notedetails_div').html());

    var scope = angular.element($('#notedetails')).scope();
    if (scope) { 
        scope.notedetails = $('#notedetails').val();
        scope.$apply();
    }

    window.setTimeout(setTextValue, 10000);
})();
