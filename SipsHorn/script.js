console.log("Sips Horn v0.0.9");

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function playSound(fileName, video, pause){
	var myAudio = new Audio();        // create the audio object
	
	
	if(pause){
		video.pause();
		myAudio.onended  = function(){
			//unpause
			video.play();
			};
	}
	
			
	myAudio.volume = video.volume;
	myAudio.src = chrome.extension.getURL(fileName + ".mp3"); // assign the audio file to it
	
	myAudio.play();                   
}

var lastSec = -100000;	

//only calls whatever 
var lastTime = -1;
function filterTimeUpdate(e, callback){
	var nowSec = Math.floor(e.srcElement.currentTime);
	
	//console.log(' ' + lastSec + ' ' + nowSec);
	if(Number.isInteger(nowSec) &&  lastSec != nowSec )
		checkSounds(e.srcElement);
	

	lastSec = nowSec;
}


 function checkSounds(video){
	//if at the start
	if(Math.floor(video.currentTime) == 0){
		console.log('play horn');
		playSound('foghorn', video, true);
	}else if(Math.floor(video.duration) - Math.floor(video.currentTime)  == 10){ //10 seconds remaining
		playSound('chiptune',video, false);
	}
};		

$(function(){
	
	var video = $("video").get(0);
	var enabled = false;


	video.oncanplay = function(e){
		
		enabled = $(".yt-user-info>a").get(0).text == "Sips";
	}

	video.ontimeupdate = function(e){
		if(enabled)
			filterTimeUpdate(e, checkSounds);
	};
	//checking time on this one too so i don't get the fraction of a second of audio before the pause and the horn
	video.onplaying = video.ontimeupdate;

});
