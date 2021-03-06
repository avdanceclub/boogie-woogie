/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
var contestantId;
var group;

var youtubeCollection = {"bib1" : "WpUwkrymVOQ", "bib2" : "ml1TRx1jmBA", "bib3" : "y_bcHMtFTl0", "bib4" : "avUc455Uwsk", "bib5" : "pi63WOE1Iv8", "bib6" : "XFGIwJy7_I8", "bib7" : "Snpo6XjnuXQ", "bib8" : "1ZDtQuRqcGo", "bib9" : "F1Ve6yba2fA", "bib10" : "2z9m1MB6CP0", "bib11" : "kjf7oIWFh8E", "bib12" : "4BPnTvLhIiM", "bib13" : "mR92eGCVU1M", "bib14" : "rgPPnDTvjhw", "bib15" : "qWxNqV88BkE", "bib16" : "pwXh3a65tgM", "bib18" : "cMb-HyeM8Fc", "bib19" : "Vv9oaOd2VdM", "bib20" : "tZq6YPl5sMI", "bib21" : "e4Mt6tESOfE", "bib22" : "aFF1qcw_WuE", "bib23" : "tM68b7qvtl0" ,"bib24" : "h0e-7UxfY88" ,"bib26" : "YX5jIJavicQ", "bib27" : "L2xxR6bLA_I", "bib28" : "VWIF6yyErr4", "bib29" : "-JZUytBJjaw", "bib30" : "lxiY-DYtQKg", "bib31" : "gW6qZXnYgDo", "bib32" : "Q1ZYFzEYxr4", "bib33" : "VqO0VNlpbKs", "bib35" : "GHEGAi0hP3k", "bib36" : "GaFJd9w03Ds", "bib37" : "b2ax-AWuF1Q", "bib38" : "gqBOFnueQsk", "bib39" : "y35LlI6fsSI", "bib40" : "LqHiBSNEib8", "bib41" : "Scu34QJXiqk", "bib42" : "BuFmeRHJQDw", "bib43" : "UBfod0uanoM", "bib44" : "gcTXfmOD8aI", "bib45" : "wEZ677F7qRQ", "bib47" : "YdD9UGl1UvI", "bib48" : "6pt7AQdStx0", "bib49" : "KlMILNDtKf8"}

// var api = "/contestants/";
var apiHost = "https://mighty-mountain-60127.herokuapp.com";
// var apiHost = "http://localhost:3000"

$(function () {
    contestantId = location.search.replace("?contestantid=", "");
    if (!contestantId) {
        alert("Contestant Id is invalid")
    }
    var storedConts = sessionStorage.getItem('contestants')
    var contestantDetails;
    var contestants;
    if (storedConts && storedConts.length) {
        contestants = JSON.parse(sessionStorage.getItem('contestants'));
        contestantDetails = contestants.data.find(item => item._id == contestantId);
        displayContestantsDetails(contestantDetails)
    } else {
        $.getJSON(`${apiHost}/contestants/${contestantId}`, function (contestantDetails) {
            displayContestantsDetails(contestantDetails)
        })
    }
    $('#submitPhone input').on("input", function(e)  {
        $('#submitPhone').find(":submit").prop("disabled", false);
    });

    $('#submitOtp input').on("input", function(e)  {
        $('#submitOtp').find(":submit").prop("disabled", false);
    });
})

function displayContestantsDetails(contDetails) {
    // console.log(contDetails);
    let goldenTicket = [53,59,3,33];
    
    group = contDetails.Group;
    var contestantName = contDetails.Name.toLowerCase();
    if (contDetails.PartnerName){
        contestantName = contestantName+" & "+contDetails.PartnerName.toLowerCase();
    }

    var youtubeid = "qR7QX9cS6cc";
    if(youtubeCollection['bib'+contDetails.SemiFinalBibNo]) {
        youtubeid = youtubeCollection['bib'+contDetails.SemiFinalBibNo]
    } else if (contDetails.Name === "Anurag Anantwar"){
        youtubeid = "QvPoVqUDArk";
    } else if (contDetails.Name === "Prarthana Nilawar"){
        youtubeid = "5EIRN052Bms";
    }



    $("#contestantName").html(contestantName)
    $("#contestantRegId").text(contDetails.ID)
    $("#contestantDanceType").text(contDetails.DanceType)
    $("#contestantGrp").text(contDetails.Group === "A" ? "A - Age 9-18 Years" : "B - Age 18+ Years")
    // if(youtubeid) {
    //     $("#contestantVideo").attr("src", `https://www.youtube.com/embed/${youtubeCollection['bib'+contDetails.SemiFinalBibNo]}?rel=0`)
    // }
    $("#contestantImage").attr("src", `images/participants/${contDetails.AuditionBibNo}.JPG`)

    let youtubehtml = `<iframe id="contestantVideo" width="560" height="315"
    src="https://www.youtube.com/embed/${youtubeid}?rel=0" frameborder="0"
    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen=""></iframe>`;

    $("#video-container").html(youtubehtml);

    if(goldenTicket.includes(contDetails.AuditionBibNo)){
        $(".votingpanel").html("<img src='images/goldenbig.png'></img>")
    } 

    decorateSocialShares(contDetails)
}


function showSuccessAnimation() {
    $('#myModal').modal('show');
    $(".check").attr("class", "check check-complete success");
    $(".fill").attr("class", "fill fill-complete success");
    $(".path").attr("class", "path path-complete");
}

// Attach a submit handler to the form
$("#submitPhone").submit(function (event) {
    // $('#myModal').modal('show');

    // Stop form from submitting normally
    event.preventDefault();
    // prevent duplicate form submission
    $(this).find(":submit").attr('disabled', 'disabled');

    // Get some values from elements on the page:
    var $form = $(this),
        // contId = $form.find("#contestantId").val(),
        phone = $form.find("#mobilenumber").val(),
        url = $form.attr("action");

    formData = {
        phoneNumber: phone,
        contestantId: contestantId,
        group : group
    }
    // Send the data using post
    var posting = $.post(apiHost+url, formData);

    // Put the results in a div
    posting.done(function (data) {
        console.log(data);
        if (data.Status === 'Success') {
            Object.assign(formData, {
                sessionId: data.Details
            })
            //show the OTP form
            $("#submitOtp").show();
            $("#form-alert").removeClass('alert-danger hide').addClass('alert-success show').text("You should receive OTP soon!");
            // $("#form-alert").toggleClass('hide').removeClass('alert-danger').addClass('alert-success').text("You should receive OTP soon!");
        } else {
            // $('#myModal').modal('hide');
            $("#form-alert").removeClass('hide').addClass('alert-danger show').text(data.Status);
        }
    });
});


// Attach a submit handler to the form
$("#submitOtp").submit(function (event) {
    // Stop form from submitting normally
    event.preventDefault();
    // prevent duplicate form submission
    $(this).find(":submit").attr('disabled', 'disabled');

    // Get some values from elements on the page:
    var $form = $(this),
        url = $form.attr("action");
    formData['otp'] = $form.find("#otp").val();
    formData['group'] = group;
    // Send the data using post
    var posting = $.post(apiHost+url, formData);

    // Put the results in a div
    posting.done(function (data) {
        console.log(data);
        if (data.Status === 'Success') {
            $("#form-alert").removeClass('hide alert-danger').addClass('alert-success show').text("Your vote is registered. Thank you!");
            showSuccessAnimation();
        } else if (data.Status === 'Error' && data.Details == 'OTP Mismatch') {
            $("#form-alert").removeClass('alert-success show').addClass('alert-danger show').text('Please enter the correct OTP.');
            $(this).find(":submit").prop("disabled", false);
        } else if (data.Status === "Your vote is already registered!"){
            $("#form-alert").removeClass('alert-success show').addClass('alert-danger show').text('Your vote is already registered!');
        }
    }).fail( function(xhr, textStatus, errorThrown) {
        $("#form-alert").removeClass('alert-success hide').addClass('show alert-danger').text("There was some Error, please try again.");
    });;
});


function decorateSocialShares(data) {
    //set up the url
    var url = 'whatsapp://send?text=';
    //define the message text
    var text = 'Hey, Watch my live performance at AV Boogie Woogie Finale, Title Sponsors Mr. Laxmikant and Madhuri Kole, book your tickets here https://ticketees.com/dramadetails/AV%20Boogie%20Woogie';
    //encode the text
    var encodedText = encodeURIComponent(text);
    //find the link
    var $whatsApp = $('.whatsapp a');
    //set the href attribute on the link
    $whatsApp.attr('href', url + encodedText);

    var fburl = "https://www.facebook.com/sharer.php?u=http%3A%2F%2Fwww.aveventmaster.co.in%2Fcontestant.html%3Fcontestantid%3D"+data._id;
    $('.facebook a').attr('href', fburl);
  }
