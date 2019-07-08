/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
var contestantsGlobal;
$(function () {
    

    function loadContestants() {
        var contetstatHtmlString = "";
        let counter = 1;
        let totalVotes = 0;
        $.getJSON("/contestants/", function (contestants) {
            
            contestants.filter(cont => cont.Semifinalist).sort(dynamicSort("Group")).forEach(element => {
                contetstatHtmlString = `${contetstatHtmlString}<tr>
                <th scope="row">${counter}</th>
                <td>${element.ID}</td>
                <td>${element.Group}</td>
                <td>${element.Name}</td>
                <td>${element.Votes}</td>
            </tr>`
                counter++;
                totalVotes = totalVotes + element.Votes;
            });
            $("#table-head").append(contetstatHtmlString);
            $("#totalvotes").append(totalVotes);

            contestantsGlobal = contestants;
        });
        // console.log($("#participans-container"));
    }

    loadContestants();
});

function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function download() {
    var headers = {
        ID: "ID",
        Group: "Group",
        Name: "Name",
        Votes: "Votes"
    };

    var itemsFormatted = [];

    // format the data
    contestantsGlobal.filter(cont => cont.Semifinalist).sort(dynamicSort("Group")).forEach((item) => {
        itemsFormatted.push({
            ID: item.ID,
            Group: item.Group,
            Name: item.Name,
            Votes: item.Votes
        });
    });

    var fileTitle = 'contestants'; // or 'my-unique-title'

    exportCSVFile(headers, itemsFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
}