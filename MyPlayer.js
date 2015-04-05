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

	document.getElementById("playlist").addEventListener(
			"click", 
			function(event) {
				if (document.getElementById("item-active") != null) {
					document.getElementById("item-active").className="list-group-item";
					document.getElementById("item-active").id="item";
				}
				event.target.className="list-group-item active";	
				event.target.id="item-active";

				curr_audio = document.getElementById(event.target.innerHTML);
				curr_audio.play();
				play2pause();
			});

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

//--------------helper functions------------------------------------
	function play2pause() {
		document.getElementById("play").style.display = "none";
		document.getElementById("pause").style.display = "inline";
	}
	function pause2play() {
		document.getElementById("play").style.display = "inline";
		document.getElementById("pause").style.display = "none";
	}
}) ();
