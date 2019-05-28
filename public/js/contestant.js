/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
var contestantId;
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
        $.getJSON("/contestants/" + contestantId, function (contestantDetails) {
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
    $("#contestantName").text(contDetails.Name)
    $("#contestantRegId").text(contDetails.ID)
    $("#contestantDanceType").text(contDetails.DanceType)
    $("#contestantGrp").text(contDetails.Group === "A" ? "A - Age 9-18 Years" : "B - Age 18+ Years")
    $("#contestantVideo").text(contDetails.DanceType)
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
        contestantId: contestantId
    }
    // Send the data using post
    var posting = $.post(url, formData);

    // Put the results in a div
    posting.done(function (data) {
        console.log(data);
        if (data.Status === 'Success') {
            Object.assign(formData, {
                sessionId: data.Details
            })
            //show the OTP form
            $("#submitOtp").show();
            $("#form-alert").toggleClass('hide').removeClass('alert-danger').addClass('alert-success').text("You should receive OTP soon!");
        } else {
            $("#form-alert").toggleClass('hide').text(data.Status);
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
    // Send the data using post
    var posting = $.post(url, formData);

    // Put the results in a div
    posting.done(function (data) {
        console.log(data);
        if (data.Status === 'Success') {
            $("#form-alert").toggleClass('show').removeClass('alert-danger').addClass('alert-success').text("Your vote is registered. Thank you!");
        } else if (data.Status === 'Error' && data.Details == 'OTP Mismatch') {
            $("#form-alert").toggleClass('show').addClass('alert-danger').text('Please enter the correct OTP.');
            $(this).find(":submit").prop("disabled", false);
        }
    });
});