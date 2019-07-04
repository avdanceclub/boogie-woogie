/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
var contestantId;
var group;
// var api = "/contestants/";
// var apiHost = "https://mighty-mountain-60127.herokuapp.com/";
var apiHost = "http://localhost:3000"

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
    $("#contestantName").html(contestantName)
    $("#contestantRegId").text(contDetails.ID)
    $("#contestantDanceType").text(contDetails.DanceType)
    $("#contestantGrp").text(contDetails.Group === "A" ? "A - Age 9-18 Years" : "B - Age 18+ Years")
    $("#contestantVideo").text(contDetails.DanceType)
    $("#contestantImage").attr("src", `https://aveventmaster.s3.ap-south-1.amazonaws.com/participants/${contDetails.AuditionBibNo}.JPG`)

    if(goldenTicket.includes(contDetails.AuditionBibNo)){
        $(".votingpanel").html("<img src='images/goldenbig.png'></img>")
    }
    decorateSocialShares(contDetails)
}


// Attach a submit handler to the form
$("#submitPhone").submit(function (event) {
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
        } else if (data.Status === 'Error' && data.Details == 'OTP Mismatch') {
            $("#form-alert").removeClass('alert-success show').addClass('alert-danger show').text('Please enter the correct OTP.');
            $(this).find(":submit").prop("disabled", false);
        }
    }).fail( function(xhr, textStatus, errorThrown) {
        $("#form-alert").removeClass('alert-success hide').addClass('show alert-danger').text("There was some Error, please try again.");
    });;
});


function decorateSocialShares(data) {
    //set up the url
    var url = 'whatsapp://send?text=';
    //define the message text
    var text = 'Hey, check out my performance at AV Boogie Woogie, Title Sponsors Mr. Laxmikant and Madhuri Kole and vote for me here '+location.href;
    //encode the text
    var encodedText = encodeURIComponent(text);
    //find the link
    var $whatsApp = $('.whatsapp a');
    //set the href attribute on the link
    $whatsApp.attr('href', url + encodedText);

    var fburl = "https://www.facebook.com/sharer.php?u=http%3A%2F%2Fwww.aveventmaster.co.in%2Fcontestant.html%3Fcontestantid%3D"+data._id;
    $('.facebook a').attr('href', fburl);
  }
