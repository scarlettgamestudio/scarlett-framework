var ContentLoader = SC.ContentLoader;
var Sound = SC.Sound;

ContentLoader.loadAll({
  audios: [{ path: "DeadMemories.mp3", alias: "dead" }]
}).then(([images, files, audios]) => {
  audios.map(audio => {
    console.log(audio.alias);
  });

  var deadAudio = ContentLoader.getAudio("dead");

  var deadSound = new Sound(deadAudio);
  deadSound.setVolume(0.1);
  deadSound.play();
});
