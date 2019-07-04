/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
$(function () {
    function loadContestants() {
        var contetstatHtmlString = "";
        let counter =1;
        $.getJSON("/contestants/", function (contestants) {
            contestants.filter(cont=> cont.Semifinalist).sort().forEach(element => {
                contetstatHtmlString = `${contetstatHtmlString}<tr>
                <th scope="row">${counter}</th>
                <td>${element.ID}</td>
                <td>${element.Name}</td>
                <td>${element.Votes}</td>
            </tr>`
            counter++;
            });
            $("#table-head").append(contetstatHtmlString);
        });
        // console.log($("#participans-container"));
    }

    loadContestants();
});