// searchbar handler

$(document).ready(function(){

	var $searchField = $('#query');
	var $icon = $('#search-btn');

	//Focus Event handler
	$searchField.on('focus',function(){

		$(this).css("color","black");

		$(this).animate({
			width:'100%'
		}, 400);

		$icon.animate({
			right:'1%'
		},400);

	});

	//Blur Event Handler

	$searchField.on('blur',function(){

		if ($searchField.val() == '') {

			$searchField.animate({
				width:"45%"
			},400,function(){});

			$icon.animate({
				right:'60%'
			},400,function(){});
		}

	});

	// $('#search-form').submit(function(e){
	// 	e.preventDefault();
	// })

	search();

})

// Helper function: Get query from URL

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// Search query through API

function search(){
	//Clear result
	$('#result').html('');
	$('#buttons').html('');

	// Get form input
	q  = getUrlParameter('query');

	if (q && q !== '') {

		// Run GET Request on API
		$.get(
			"https://www.googleapis.com/youtube/v3/search",{
				part:'snippet, id',
				q:q,
				type:'video',
				key:'AIzaSyALokxTnaZYlcBuH2yk_i9sYPUK9ApkT14'},
				function(data){
					var nextPageToken = data.nextPageToken;
					var prevPageToken = data.prevPageToken;

					// Log data
					console.log(data);

					$.each(data.items,function(i,item){
						// Get output
						var output = getOutPut(item);

						// Display Results
						$('#results').append(output);

					});

					var buttons = getButtons(prevPageToken, nextPageToken);

					// Display Buttons

					$('#buttons').append(buttons);

				}
		);

	}
}


// Next page function

function nextPage(){

	var token = $('#next-button').data('token');
	var q = $('#next-button').data('query');

	//Clear result
	$('#results').html('');
	$('#buttons').html('');

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part:'snippet, id',
			q:q,
			pageToken:token,
			type:'video',
			key:'AIzaSyALokxTnaZYlcBuH2yk_i9sYPUK9ApkT14'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				// Log data
				console.log(data);

				$.each(data.items,function(i,item){
					// Get output
					var output = getOutPut(item);

					// Display Results
					$('#results').append(output);
 
				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons

				$('#buttons').append(buttons);

			}
	);
}


// Prev page function

function prevPage(){

	var token = $('#prev-button').data('token');
	var q = $('#prev-button').data('query');

	//Clear result
	$('#results').html('');
	$('#buttons').html('');

	// Run GET Request on API
	$.get(
		"https://www.googleapis.com/youtube/v3/search",{
			part:'snippet, id',
			q:q,
			pageToken:token,
			type:'video',
			key:'AIzaSyALokxTnaZYlcBuH2yk_i9sYPUK9ApkT14'},
			function(data){
				var nextPageToken = data.nextPageToken;
				var prevPageToken = data.prevPageToken;

				// Log data
				console.log(data);

				$.each(data.items,function(i,item){
					// Get output
					var output = getOutPut(item);

					// Display Results
					$('#results').append(output);

				});

				var buttons = getButtons(prevPageToken, nextPageToken);

				// Display Buttons

				$('#buttons').append(buttons);

			}
	);
}



function getOutPut(item){
	var videoId = item.id.videoId;
	var title = item.snippet.title;
	var description = item.snippet.description;
	var thumb = item.snippet.thumbnails.high.url;
	var channelTitle = item.snippet.channelTitle;
	var videoDate = item.snippet.publishedAt;

	var output = '<li>' +
	'<div class = "list-left">' +
		'<img src= "'+ thumb +'">' +
	'</div>' +
	'<div class = "list-right">' +
		'<h3><a class="various fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'">'+title+'</a></h3>' +
		'<small>By <span class="cTitle">'+channelTitle +'</span> on ' + videoDate+ '</small>' +
		'<p>'+description+'</p>' +
	'</div>' +
	'</li>' + 
	'<div class = "clearfix"></div>' +
	'';

	return output;

}

function getButtons(prevPageToken, nextPageToken){
	if (!prevPageToken) {
		var btnoutput = '<div class = "button-container">' + 
		'<button id = "next-button" class = "paging-button" data-token = "'+nextPageToken+'"data-query = "'+q+'"' +
		'onclick="nextPage();">Next >></button></div>';
	} else {
		var btnoutput = '<div class = "button-container">' + 
		'<button id = "prev-button" class = "paging-button" data-token = "'+prevPageToken+'"data-query = "'+q+'"' +
		'onclick="prevPage();"><< Prev</button>' +
		'<button id = "next-button" class = "paging-button" data-token = "'+nextPageToken+'"data-query = "'+q+'"' +
		'onclick="nextPage();">Next >></button></div>';
	}

	return btnoutput;

}