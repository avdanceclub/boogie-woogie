/* HTML document is loaded. DOM is ready.
-------------------------------------------*/
$(function () {
    var contestantId = location.search.replace("?contestantid=", "");
    if(!contestantId){
        alert("Contestant Id is invalid")
    }
    var storedConts = sessionStorage.getItem('contestants')
    var contestantDetails;
    var contestants; 
    if(storedConts && storedConts.length){
        contestants = JSON.parse(sessionStorage.getItem('contestants'));
        contestantDetails = contestants.data.find(item=> item._id == contestantId);
        displayContestantsDetails(contestantDetails)
    } else {
        $.getJSON("/contestants/"+contestantId, function (contestantDetails) {
            displayContestantsDetails(contestantDetails)
        })
    }
})

function displayContestantsDetails(contDetails){
    console.log(contDetails);
    
    $("#contestantName").text(contDetails.Name)
    $("#contestantRegId").text(contDetails.ID)
    $("#contestantDanceType").text(contDetails.DanceType)
    $("#contestantGrp").text(contDetails.Group === "A" ? "A - Age 9-18 Years" : "B - Age 18+ Years")
    $("#contestantVideo").text(contDetails.DanceType)
}