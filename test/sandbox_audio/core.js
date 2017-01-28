

Sound.fromPath("DeadMemories.mp3").then(function(sound) {
  /*  setTimeout(function() {
        sound.stop();
    }, 1500);*/
    sound.setVolume(0.1);
   sound.play();
});