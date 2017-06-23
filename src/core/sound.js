import { ContentLoader } from "common/contentLoader";
import { isObjectAssigned } from "common/utils";

/**
 * Sound class
 */
export default class Sound {
  //#region Constructors

  /**
     *
     * @param audio
     */
  constructor(audio) {
    if (!isObjectAssigned(audio)) {
      throw new Error("Cannot create Sound without a valid audio source");
    }

    // private properties
    this._source = audio;
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  /**
     *
     * @param path
     * @returns {Promise}
     */
  static async fromPath(path) {
    const audio = await ContentLoader.loadAudio(path);

    if (audio === false) {
      return null;
    }

    return new Sound(audio);
  }

  // TODO: static restore

  //#endregion

  /**
     *
     * @param audio
     */
  setAudioSource(audio) {
    this._source = audio;
  }

  /**
     * plays the current audio source
     */
  play() {
    this._source.play();
  }

  /**
     * pauses the current audio source
     */
  pause() {
    this._source.pause();
  }

  /**
     * stops the current audio source
     */
  stop() {
    this._source.pause();
    this._source.currentTime = 0;
  }

  /**
     * sets the current audio source loop behavior
     * @param loop
     */
  setLoop(loop) {
    this._source.loop = loop;
  }

  /**
     * sets the current audio source output volume (0 to 1)
     * @param volume
     */
  setVolume(volume) {
    this._source.volume = volume;
  }

  //#endregion
}
