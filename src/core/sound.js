/**
 * Sound class
 */
function Sound(audio) {
    if (!isObjectAssigned(audio)) {
        throw new Error("Cannot create Sound without a valid audio source");
    }

    // private properties
    this._source = audio;
}

/**
 *
 * @param path
 * @returns {Promise}
 */
Sound.fromPath = function (path) {
    return new Promise((function (resolve, reject) {
        ContentLoader.loadAudio(path).then(function (audio) {
            resolve(new Sound(audio));

        }, function () {
            reject();

        });
    }).bind(this));
};

/**
 *
 * @param audio
 */
Sound.prototype.setAudioSource = function (audio) {
    this._source = audio;
};

/**
 * plays the current audio source
 */
Sound.prototype.play = function () {
    this._source.play();
};

/**
 * pauses the current audio source
 */
Sound.prototype.pause = function () {
    this._source.pause();
};

/**
 * stops the current audio source
 */
Sound.prototype.stop = function () {
    this._source.pause();
    this._source.currentTime = 0;
};

/**
 * sets the current audio source loop behavior
 * @param loop
 */
Sound.prototype.setLoop = function (loop) {
    this._source.loop = loop;
};


/**
 * sets the current audio source output volume (0 to 1)
 * @param volume
 */
Sound.prototype.setVolume = function (volume) {
    this._source.volume = volume;
};