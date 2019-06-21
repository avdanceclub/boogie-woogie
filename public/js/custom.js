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
//Call this funtion to fetch and store in sesssion storage
function fetchContestants() {
    var contetstatHtmlString = "";
    $.getJSON(`${api}`, function (contestants) {
        // sessionStorage.setItem('contestants', JSON.stringify({"data":contestants}));
        console.log("Contestants Loaded Successfully")
        contestants.sort(dynamicSort("Group"))
        console.log(contestants)
        let youtube = 'https://www.youtube.com/embed/WA4_DJvrU30';
        contestants.forEach(element => {
            contetstatHtmlString = `${contetstatHtmlString}<div class="col-md-3 col-sm-6 col-xs-6 fadeIn" data-wow-offset="0" data-wow-delay="0.5s">
            <div class="team-wrapper ">
                <a href="contestant.html?contestantid=${element._id}">
                <img id="${element._id}" src="images/${element.imageName || 'team-img.jpg'}" class="img-responsive cont-image" alt="team img 1" data-toggle="modal" data-id="${element.ID}" data-contestant-id="${element._id}" data-name="${element.Name}" data-video="${element.youtube || youtube}">
                </a>
                    <div class="team-des">
                        <h4>${element.Name.toLowerCase()} ${element.PartnerName ? ' & '+ element.PartnerName : ''}</h4>
                    </div>
                    <div class="vote-btn-cont">
                    <a class='vote-btn' href="contestant.html?contestantid=${element._id}">
                    <i class='fa fa-thumbs-up' title='Vote for this contestant'></i>
                    </a>
                    </div>
            </div>
        </div>`
        });
        $("#participans-container").append(contetstatHtmlString);
    })
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

/* start preloader */
// $(window).load(function(){
$('.preloader').fadeOut(1000); // set duration in brackets    
// });
/* end preloader */