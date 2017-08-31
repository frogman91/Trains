var config = {
    apiKey: "AIzaSyASSdTTCtyci7VZDM60TRRw6pd0HkLKp60",
    authDomain: "trains-d07f8.firebaseapp.com",
    databaseURL: "https://trains-d07f8.firebaseio.com",
    projectId: "trains-d07f8",
    storageBucket: "",
    messagingSenderId: "956702543212"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var trains = database.ref("/trains");

database.ref("/trains").on("value", function(snapshot) {

	$("#trainData").empty();
	snapshot.forEach(function(snapshotChild) {
		console.log(snapshotChild.key);
		var trainObj = { 
			trainName: snapshotChild.val().trainName,
			destination: snapshotChild.val().destination,
			frequency: snapshotChild.val().frequency,
			firstTrain: snapshotChild.val().firstTrain,
			trainMin: snapshotChild.val().trainMin,
			key: snapshotChild.key
		};
		updateTable(trainObj);
	});

});

function updateTable(val){
	$("#trainData").append("<tr><td>" + 
		val.trainName + "</td><td>" + val.destination + "</td><td>" + 
		val.frequency + "</td><td>" + val.firstTrain + "</td><td>" + val.trainMin + "</td><td><button class='removeTrain' data-value='" + 
		val.key + "'>x</button></td></tr>");
}

$("#btnSubmit").on("click", function(event) {

	event.preventDefault();
	
	var trainName = $("#trainName").val().trim();
	var destination = $("#destination").val().trim();
	var frequency = $("#frequency").val().trim();

	var firstTrain = $("#firstTrain").val();

	var tFrequency = frequency;

    // Time is 3:30 AM
    var firstTime = firstTrain;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    var trainMin = tMinutesTillTrain;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
   	firstTrain = moment(nextTrain).format("hh:mm");

	database.ref("/trains").push({
		trainName: trainName,
		destination: destination,
		frequency: frequency,
		firstTrain: firstTrain,
		trainMin: trainMin
	});

	$("#trainName, #destination, #frequency, #firstTrain").val("");
});

$("body").on("click", ".removeTrain", function() {

	database.ref("/trains").child($(this).attr("data-value")).remove();

});
