/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
$(function () {

    /* start typed element */
    //http://stackoverflow.com/questions/24874797/select-div-title-text-and-make-array-with-jquery
    var subElementArray = $.map($('.sub-element'), function (el) {
        return $(el).text();
    });
    $(".element").typed({
        strings: subElementArray,
        typeSpeed: 30,
        contentType: 'html',
        showCursor: false,
        loop: false,
        loopCount: true,
    });
    /* end typed element */

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


    function loadContestants() {
        var contetstatHtmlString = "";
        $.getJSON("http://localhost:3000/contestants/", function (contestants) {
            let youtube = 'https://www.youtube.com/embed/WA4_DJvrU30';
            contestants.forEach(element => {
                contetstatHtmlString = `${contetstatHtmlString}<div class="col-md-3 col-sm-6 col-xs-12 wow fadeIn" data-wow-offset="0" data-wow-delay="0.5s">
            <div class="team-wrapper">
                <img id="${element.ID}" src="images/${element.imageName || 'team-img1.jpg'}" class="img-responsive" alt="team img 1" data-toggle="modal" data-id="${element.ID}" data-contestant-id="${element._id}" data-name="${element.Name}" data-video="${element.youtube || youtube}" data-target=".profile-modal-lg">
                    <div class="team-des">
                        <h4>${element.Name.toLowerCase()}</h4>
                    </div>
            </div>
        </div>`
            });
            $("#participans-container").append(contetstatHtmlString);
        });
        // console.log($("#participans-container"));
    }

    loadContestants();

    var contestantId = location.search.replace("?contestantId=", "");
    $("#" + contestantId).trigger('click');
});

/* start preloader */
// $(window).load(function(){
$('.preloader').fadeOut(1000); // set duration in brackets    
// });
/* end preloader */
var formData = {};

$(document).on('show.bs.modal', '#myModal', function (e) {
    var button = $(e.relatedTarget) // Button that triggered the modal
    var modal = $(this);
    //Clear forms
    modal.find("#contestantId").val();
    modal.find("#mobilenumber").val();
    formData = {};
    //Set values to be used later
    modal.find('.title,.contestantName').text(button.data('name'))
    modal.find('#contestantId').val(button.data('contestant-id'))
    modal.find('.iframe').attr('src', button.data('video'))

});


// Attach a submit handler to the form
$("#submitPhone").submit(function (event) {
    // Stop form from submitting normally
    event.preventDefault();

    // Get some values from elements on the page:
    var $form = $(this),
        contId = $form.find("#contestantId").val(),
        phone = $form.find("#mobilenumber").val(),
        url = $form.attr("action");

    formData = {
        phoneNumber: phone,
        contestantId: contId
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
           setTimeout(function(){
               $('#myModal').modal('hide')
           },3000)

        } else if (data.Status === 'Error'&& data.Details == 'OTP Mismatch') {
            $("#form-alert").toggleClass('show').addClass('alert-danger').text('Please enter the correct OTP.');
        }
    });
});