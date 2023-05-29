$.getJSON("qs.json", function (data) {
	var qaPairs = data.qa_pairs;
	 
	// Listen for user input
	$(".send-button").on("click", function () {
	var similarityScores = [];
	var userInput = $(".input-message").val();
	// Add user message to chat window
	$(".messages-list").append(`
	<li class="user-message">${userInput}</li>`
	);
	// Find the most similar question to user's input based on the ID
	for (var i = 0; i < qaPairs.length; i++) {
	similarityScores.push({id: qaPairs[i].id, score: similarity(userInput, qaPairs[i].question)});
	}
	// Find the ID of the most similar question
	var maxIndex = similarityScores.reduce((iMax, x, i, arr) => x.score > arr[iMax].score ? i : iMax, 0);
	var maxId = similarityScores[maxIndex].id;
	// Find the answer(s) corresponding to the most similar question
	var answers = null;
	for (var j = 0; j < qaPairs.length; j++) {
	if (qaPairs[j].id === maxId) {
	answers = qaPairs[j].answers; // get all the possible answers
	break;
	}
	}
	 
	// check if the answer(s) is/are numerical or not
	if (answers.length === 1) {
		var answer = answers[0]; // if only one answer, use that answer
		} else {
		var randomIndex = Math.floor(Math.random() * answers.length); // choose a random index
		var answer = answers[randomIndex]; // get the corresponding answer
		}
	// Add bot message to chat window with the answer to the most similar question
	$(".messages-list").append(`
	<li class="bot-message">${answer}</li>`
	);
	// Scroll to the bottom of the chat window
	$('.chatbot-body').scrollTop($('.chatbot-body')[0].scrollHeight);
	// Clear the input field
	$(".input-message").val("");
	});
	});
	// Function to calculate the cosine similarity between two strings
	function similarity(s1, s2) {
	var words1 = s1.trim().toLowerCase().split(/[\s,]+/);
	var words2 = s2.trim().toLowerCase().split(/[\s,]+/);
	var dict = {};
	for (var i = 0; i < words1.length; i++) {
	if (!(words1[i] in dict)) {
	dict[words1[i]] = { count1: 0, count2: 0 };
	}
	dict[words1[i]].count1++;
	}
	for (var i = 0; i < words2.length; i++) {
	if (!(words2[i] in dict)) {
	dict[words2[i]] = { count1: 0, count2: 0 };
	}
	dict[words2[i]].count2++;
	}
	var dotProduct = 0;
	var magnitude1 = 0;
	var magnitude2 = 0;
	for (var word in dict) {
	dotProduct += dict[word].count1 * dict[word].count2;
	magnitude1 += Math.pow(dict[word].count1, 2);
	magnitude2 += Math.pow(dict[word].count2, 2);
	}
	return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
	}
	