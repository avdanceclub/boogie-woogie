/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
$(function () {
    function loadContestants() {
        var contetstatHtmlString = "";
        let counter =1;
        let totalVotes = 0;
        $.getJSON("/contestants/", function (contestants) {
            contestants.filter(cont=> cont.Semifinalist).sort().forEach(element => {
                contetstatHtmlString = `${contetstatHtmlString}<tr>
                <th scope="row">${counter}</th>
                <td>${element.ID}</td>
                <td>${element.Name}</td>
                <td>${element.Votes}</td>
            </tr>`
            counter++;
            totalVotes = totalVotes+element.Votes;
            });
            $("#table-head").append(contetstatHtmlString);
            $("#totalvotes").append(totalVotes);
        });
        // console.log($("#participans-container"));
    }

    loadContestants();
});