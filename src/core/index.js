export { default as Camera2D } from "./camera2D";
export { default as Color } from "./color";
export { default as FontStyle } from "./fontStyle";
export { default as Game } from "./game";
export { default as GameManager } from "./gameManager";
export { default as GameObject } from "./gameObject";
export { default as GameScene } from "./gameScene";
export { default as PrimitiveBatch } from "./primitiveBatch";
export { default as PrimitiveRender } from "./primitiveRender";
export { default as Script } from "./script";
import { Scripts } from "./scripts";

// aliases
// there is the need to do a binding because
// otherwise the reference to the original object (singleton) would be lost
const addScript = Scripts.addScript.bind(Scripts);
const assignScript = Scripts.assign.bind(Scripts);

export { Scripts, addScript, assignScript };

export { default as Sound } from "./sound";
export { default as Sprite } from "./sprite";
export { default as SpriteBatch } from "./spriteBatch";
export { default as Stroke } from "./stroke";
export { default as Text } from "./text";
export { default as Texture2D } from "./texture2D";
export { default as Transform } from "./transform";
export { WrapMode } from "./wrapMode";
