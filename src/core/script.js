/**
 * Base class for scripts
 */
export default class Script {
  /**
     * Anchor method for updating
     * @param delta
     */
  update(delta) {}

  /**
     * Anchor method for rendering
     * @param delta
     * @param spriteBatch
     */
  render(delta, spriteBatch) {}
}
