$(document).ready(function () {

	// Initializes Firebase
	var config = {
		apiKey: "AIzaSyCOAkD3U7fdV3RasnZ1iLFxv00KIUspCfs",
		authDomain: "ucb-eli-test.firebaseapp.com",
		databaseURL: "https://ucb-eli-test.firebaseio.com",
		projectId: "ucb-eli-test",
		storageBucket: "ucb-eli-test.appspot.com",
		messagingSenderId: "554349661256"
	};

	firebase.initializeApp(config);

	// Assigns the reference to the database to a variable named 'database'
	var database = firebase.database();

	// button click listener
	$("#addTrain").on("click", function () {

		event.preventDefault();

		// Assigns user form input to variables
		var trainName = $("#nameInput").val().trim();
		var lineName = $("#lineInput").val().trim();
		var destination = $("#destinationInput").val().trim();
		var trainTimeInput = $("#trainTimeInput").val().trim();
		var frequencyInput = $("#frequencyInput").val().trim();

		// Creates local "temporary" object for holding train data
		var newTrain = {
			name: trainName,
			line: lineName,
			destination: destination,
			trainTime: trainTimeInput,
			frequency: frequencyInput,
		};

		// Uploads train data to the database
		database.ref().push(newTrain);

		// clears text-boxes
		$("#nameInput").val("");
		$("#lineInput").val("");
		$("#destinationInput").val("");
		$("#trainTimeInput").val("");
		$("#frequencyInput").val("");

		// Prevents page from refreshing
		return false;

	});

		// Creates Firebase event for adding a train to the database and a row in the html when a user adds an entry
		database.ref().on("child_added", function (snapshot) {

		// Stores train infro into variables 
		var firebaseName = snapshot.val().name;
		var firebaseLine = snapshot.val().line;
		var firebaseDestination = snapshot.val().destination;
		var firebaseTrainTimeInput = snapshot.val().trainTime;
		var firebaseFrequency = snapshot.val().frequency;

		// "ETA" and "Minutes Away" math

		// Start Time (pushed back 1 year to make sure it comes before current time)
		var startTimeConverted = moment(firebaseTrainTimeInput, "HH:mm").subtract(1, "years");

		// Current Time
		var currentTime = moment();

		// Difference between the times
		var diffTime = moment().diff(moment(startTimeConverted), "minutes");

		// Time apart (remainder)
		var tRemainder = diffTime % firebaseFrequency;

		// Minute Until Train
		var tMinutesTillTrain = firebaseFrequency - tRemainder;

		// Next Train
		var nextTrain = moment().add(tMinutesTillTrain, "minutes");

		// Creates the new row
		var newRow = $("<tr>").append(
			$("<td>").text(firebaseName),
			$("<td>").text(firebaseLine),
			$("<td>").text(firebaseDestination),
			$("<td>").text(firebaseFrequency),
			$("<td>").text(nextTrain),
			$("<td>").text(tMinutesTillTrain),
		);

		// Appends the new row to the table
		$("#trainTable > tbody").append(newRow);

	});

});
