/**
 * Base class for scripts
 */
export default class Script {
  /**
     * Anchor method for updating
     * @param delta
     */
  // eslint-disable-next-line
  update(delta) {}

  /**
     * Anchor method for rendering
     * @param delta
     * @param spriteBatch
     */
  // eslint-disable-next-line
  render(delta, spriteBatch) {}
}
