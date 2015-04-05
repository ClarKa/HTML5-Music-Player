(function() {
	$("#slidedown").click(function() {
		$("#playlist").slideToggle("fast");
		$("#slidedown").css("display","none");
		$("#slideup").css("display","block")
	});
	
	$("#slideup").click(function() {
		$("#playlist").slideToggle("fast");
		$("#slideup").css("display","none");
		$("#slidedown").css("display","block")
	});

	var curr_audio;
	var curr_audioValue;
	var audioList = document.getElementsByTagName("audio");
	//console.log(audioList);


	document.getElementById("playlist").addEventListener(
			"click", 
			function(event) {
			/*	if (document.getElementById("item-active") != null) {
					document.getElementById("item-active").className="list-group-item";
					document.getElementById("item-active").id="item";
				}

				event.target.className="list-group-item active";	
				event.target.id="item-active";*/

				curr_audioValue = parseInt(event.target.getAttribute("data-value"));

				loadNewAudio(curr_audioValue);
			});

//-------------control buttons---------------------------------------------
	document.getElementById("play").addEventListener(
			"click",
			function() {
				if(curr_audio === undefined) {
					alert("Please select an audio from playlist to play!");
					return;
				}
				play2pause();
				curr_audio.play();
			});

	document.getElementById("pause").addEventListener(
			"click",
			function() {
				pause2play();
				curr_audio.pause();
			});

	document.getElementById("stop").addEventListener(
			"click",
			function() {
				if(curr_audio === undefined) {
					alert("Please select an audio from playlist to play!");
					return;
				}
				pause2play();
				curr_audio.load();
				$(".current").html(formatTime(0));
				$("#progress_bar").width('0%');
			});
	
	$("#next").click(function() {
		curr_audioValue++;
		loadNewAudio(curr_audioValue);
	});
			
	$("#prev").click(function() {
		curr_audioValue--;
		loadNewAudio(curr_audioValue);
	});
	
	$('audio').on('ended',function(){
		pause2play();
	});

	$('audio').on('playing', function() {
		if (curr_audioValue+1 == audioList.length) {
			$("#next").addClass("disabled");
			console.log("Next Button Disabled");
		}
		else {
			$("#next").removeClass("disabled");
		}

		if (curr_audioValue == 0) {
			$("#prev").addClass("disabled");
			console.log("Prev Button Disabled");
		}
		else {
			$("#prev").removeClass("disabled");
		}
	});

//-------------Progress bar--------------------------------
	$('audio').on("timeupdate",function(){
		var cur = curr_audio.currentTime;
		var bar_width = [cur/curr_audio.duration*100 + '%'];
		$(".current").html(formatTime(cur));
		$("#progress_bar").width(bar_width);
	});


	
//--------------helper functions------------------------------------
	function play2pause() {
		$("#pause").removeClass("hidden");
		$("#play").addClass("hidden");
	}

	function pause2play() {
		$("#pause").addClass("hidden");
		$("#play").removeClass("hidden");
	}

	function formatTime(seconds) {
		var min = Math.round(seconds/60);
		var sec = Math.round(seconds%60);
		var time = [min + " : " + sec];
		return time;
	}

	function loadNewAudio(curr_audioValue) {
		if (curr_audio !== undefined) {
			curr_audio.load();
		}

		curr_audio = audioList[curr_audioValue];
		curr_audio.play();
		play2pause();

		var time = formatTime(curr_audio.duration);
		$(".duration").html(time);

		console.log(["Now Playing " + curr_audioValue + " of " + audioList.length + " Song in the Playlist"]);

		//--------------switch playlist entries between active and non-active------------------------------
		if ($("#item-active") != null) {
			$("#item-active").removeClass("active");
			$("#item-active").removeAttr("id");
		}

		var tmp = $(".list-group-item")[curr_audioValue];
		$(tmp).addClass("active");
		$(tmp).attr("id","item-active");
	}

}) ();
