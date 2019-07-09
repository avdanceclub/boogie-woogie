/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
// var api = "/contestants";
var api = "https://mighty-mountain-60127.herokuapp.com/contestants/";
$(function () {
    /* Smooth scroll and Scroll spy (https://github.com/ChrisWojcik/single-page-nav)    
    ---------------------------------------------------------------------------------*/
    $('.templatemo-nav').singlePageNav({
        offset: $(".templatemo-nav").height(),
        filter: ':not(.external)',
        updateHash: false
    });


    /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
    $('.navbar-collapse a').click(function () {
        $(".navbar-collapse").collapse('hide');
    });
    /* end navigation top js */

    $('body').bind('touchstart', function () {});

    /* wow
    -----------------*/
    new WOW().init();

    fetchContestants();

});
let contestants;
//Call this funtion to fetch and store in sesssion storage
function fetchContestants() {
    var contetstatHtmlString = "";
    $.getJSON(`${api}`, function (contestantsAll) {
        // sessionStorage.setItem('contestants', JSON.stringify({"data":contestants}));
        console.log("Contestants Loaded Successfully")
        contestantsAll.sort(dynamicSort("Group"));
        contestants = contestantsAll
        // console.log(contestants);
        filterParticipants('semi');
    })
}

function prepareContestantHtml(participants) {
    var contetstatHtmlString = "";
    let groupA = participants.filter(ele => ele.Group === "A");
    let groupB = participants.filter(ele => ele.Group === "B");
    
    $("#participans-container-a").html("").append(getParticipantHTML(groupA));
    $("#participans-container-b").html("").append(getParticipantHTML(groupB));
}

function getParticipantHTML(list) {
    let goldenTicket = [53,59,03,33];
    var contetstatHtmlString = "";
    list.forEach(element => {
        contetstatHtmlString = `${contetstatHtmlString}<div class="col-md-3 col-sm-6 col-xs-6 ${goldenTicket.includes(element.AuditionBibNo) ? "golden" : ""}" data-wow-offset="0" data-wow-delay="0.5s">
    <div class="team-wrapper ">
        <a href="contestant.html?contestantid=${element._id}">
        <img id="${element._id}" src="images/participants/${element.AuditionBibNo}.JPG" onerror="this.onerror=null;this.src='images/team-img.jpg';" class="img-responsive cont-image" alt="team img 1" data-toggle="modal">
        </a>
            <div class="team-des">
                <h4>${element.Name.toLowerCase()} ${element.PartnerName ? ' & '+ element.PartnerName : ''}</h4>
            </div>
            <div class="vote-btn-cont">
            <a class='vote-btn' href="contestant.html?contestantid=${element._id}">
            ${goldenTicket.includes(element.AuditionBibNo) ? "" : "Checkout my Profile"}
            </a>
            </div>
    </div>
</div>`
    });

    return contetstatHtmlString;
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function filterParticipants(filter) {
    $(".participants-filter .btn").removeClass("active");
    $(".participants-filter ." + filter).addClass("active");
    if (filter === "all") {
        prepareContestantHtml(contestants)
    } else if (filter === "semi") {
        let semiFinalist = contestants.filter((ele) => ele.Semifinalist);
        prepareContestantHtml(semiFinalist)
    } else if (filter === "final") {
        let finalist = contestants.filter((ele) => ele.Finalist)
        prepareContestantHtml(finalist)
    }
}

/* start preloader */
// $(window).load(function(){
$('.preloader').fadeOut(1000); // set duration in brackets    
// });
/* end preloader */