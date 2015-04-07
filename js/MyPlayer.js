(function() {

	$(document).ready(function() {
		alert("Drag and drop some music into this page to start!");
	})

	var curr_audio;
	var curr_audioValue;
	var audioList = document.getElementsByTagName("audio");
	var vol = 1;
	var player = document.getElementById('player');
	var dropbox = document.getElementsByTagName("body")[0];
	//console.log(audioList);

	$("#slidedown").click(function() {
		$("#playlist").slideToggle("fast");
		$(this).addClass("hidden");
		$("#slideup").removeClass("hidden");
	});
	
	$("#slideup").click(function() {
		$("#playlist").slideToggle("fast");
		$(this).addClass("hidden");
		$("#slidedown").removeClass("hidden");
	});

	document.getElementById("playlist").addEventListener(
			"click", 
			function(event) {
				curr_audioValue = parseInt(event.target.getAttribute("data-value"));
				loadNewAudio();
			});

//-------------control buttons---------------------------------------------
	document.getElementById("play").addEventListener(
			"click",
			function() {
				if(curr_audio === undefined) {
					if(audioList.length == 0) {
						alert('Please drag some audio files into the page to add it into the playlist!');
						return
					}
					alert("Please select an audio from the playlist to play!");
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
					alert("Please select an audio from the playlist to play!");
					return;
				}
				pause2play();
				curr_audio.load();
				$("#current").html(formatTime(0));
				$("#progress_bar").width('0%');
			});
	
	$("#next").click(function() {
		curr_audioValue++;
		loadNewAudio();
	});
			
	$("#prev").click(function() {
		curr_audioValue--;
		loadNewAudio();
	});

	//--------disable Prev/Next button while hit the top/bottom of playlist------------
	function addBtnListener() {
		curr_audio.onplaying = function() {
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
		};
	}

//-------------Progress bar--------------------------------
	function addTimeUpdate() {
		curr_audio.ontimeupdate = function(){
			var cur = curr_audio.currentTime;
			var bar_width = [cur/curr_audio.duration*100 + '%'];
			$("#current").html(formatTime(cur));
			$("#progress_bar").width(bar_width);
		};
	}

	$('#progress').click(function(event) {
		var x = event.pageX;
		var offset = $(this).offset();
		if (curr_audio !== undefined) {
			curr_audio.currentTime = (x-offset.left)/$(this).width()*curr_audio.duration;
			console.log("skip to " + curr_audio.currentTime);
		}
	});

//---------------volume control-------------------------------
	$('#volume').click(function(event) {
		var x = event.pageX;
		var offset = $(this).offset();
		vol = (x-offset.left)/$(this).width();
		var bar_width = [vol/1 * 100 + '%']
		$('#volume_bar').width(bar_width);
		if (curr_audio !== undefined) {
			curr_audio.volume = vol;
			console.log('Volume = ' + curr_audio.volume);
		}
		
		if (vol !== 0) {
			document.getElementById("volume_icon").className = "glyphicon glyphicon-volume-up";
		}
	});

	$('#volume_icon').click(function() {
		vol = 0;
		if (curr_audio !== undefined) {
			curr_audio.volume = vol;
		}
		console.log('Muted');
		$('#volume_bar').width("0%");

		this.className = "glyphicon glyphicon-volume-off";
	});

/*	//-----------------volume listener--------------------------
 * 	function addVolumeListener() {
 *		curr_audio.onplaying = function() {
 *			curr_audio.volume = vol;
 *			console.log('Volume = ' + curr_audio.volume);
 *		};
 *	}
 */

//--------------drag&drop to add in playlist-----------------------------
	dropbox.addEventListener(
			'drop',
			function(event) {
				event.stopPropagation();
				event.preventDefault();

				//-------create new playlist entry----------------
				var input = event.dataTransfer.files;
				var name;
				var newNode;
				var url;
				var newNode2;
				for(i=0;i<input.length;i++) {
					name = input[i].name;
					newNode = $('<a></a>').text(name);
					$(newNode).attr('href','#');
					$(newNode).addClass('list-group-item'); 
					$(newNode).attr('data-value',audioList.length);
					$('#playlist').append(newNode);

					//-------create new audio element-----------------
					url = window.URL.createObjectURL(input[i]);
					newNode2 = $('<audio></audio>');
					$(newNode2).attr('src',url);
					$('#playlist').append(newNode2);

					$('#next').removeClass('disabled');
				}
			
			});

	dropbox.addEventListener(
			'dragover', 
			function(event) {
				event.stopPropagation();
				event.preventDefault();
			});

	dropbox.addEventListener(
			'dragenter',
			function(event) {
				event.stopPropagation();
				event.preventDefault();
			});

//--------------helper functions------------------------------------
	function addEndListener() {
		curr_audio.onended = function(){
		pause2play();
		//---------continue playing------------
		nextToPlay();
		};
	}
	
	function play2pause() {
		$("#pause").removeClass("hidden");
		$("#play").addClass("hidden");
	}

	function pause2play() {
		$("#pause").addClass("hidden");
		$("#play").removeClass("hidden");
	}

	function formatTime(seconds) {
		var min = Math.floor(seconds/60);
		var sec = Math.floor(seconds%60);
		var time = [min + " : " + sec];
		return time;
	}

	function nextToPlay() {
		curr_audioValue = (curr_audioValue+1) % audioList.length;
		loadNewAudio(); 
	}

	function loadNewAudio() {
		var new_audio = audioList[curr_audioValue];
		if (curr_audio !== undefined && new_audio !== curr_audio) {
			curr_audio.load();
		}

		curr_audio = new_audio;
		play2pause();

		addTimeUpdate();
		addEndListener();
		addBtnListener();

		curr_audio.volume = vol;
		console.log('Volume = ' + curr_audio.volume);
		curr_audio.play();

		console.log(curr_audio);
		console.log(curr_audio.duration);

		var time = formatTime(curr_audio.duration);
		$("#duration").html(time)

		console.log("Now Playing " + curr_audioValue + " of " + audioList.length + " Song in the Playlist");

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
