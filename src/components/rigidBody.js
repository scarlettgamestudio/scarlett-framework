/**
 *    RigidBody Class
 */

import Matter from "matter-js";
import GameManager from "core/gameManager";
import { isObjectAssigned } from "common/utils";
import { isSprite } from "core/sprite";

export default class RigidBody {
  //#region Constructors

  /**
     *
     * @param params
     */
  constructor(params) {
    params = params || {};

    // public properties
    this.gameObject = null;

    // private properties
    this._isStatic = params.static || false;
    this._mass = params.mass || null;
    this._friction = params.friction || null;
    this._body = null;
  }

  //#endregion

  //#region Public Methods

  //#region Static Methods

  //#endregion

  setMass(mass) {
    this._mass = mass;
    Matter.Body.setMass(this._body, this._mass);
  }

  getMass() {
    return this.mass;
  }

  // eslint-disable-next-line
  setGameObject(gameObject) {
    this._sync();
  }

  onGameObjectDetach() {
    this.gameObject.transform.clearPositionGetter();
    this.gameObject.transform.clearScaleGetter();
    this.gameObject.transform.clearRotationGetter();
  }

  onGameObjectPositionUpdated(value) {
    if (isObjectAssigned(this._body)) {
      Matter.Body.setPosition(this._body, value);
    }
  }

  onGameObjectRotationUpdated(value) {
    if (isObjectAssigned(this._body)) {
      Matter.Body.setAngle(this._body, value);
    }
  }

  onGameObjectScaleUpdated(value) {
    if (isObjectAssigned(this._body)) {
      Matter.Body.scale(this._body, value.x, value.y);
    }
  }

  unload() {
    // TODO: do this
  }

  //#endregion

  //#region Private Methods

  _sync() {
    let self = this;

    if (!isObjectAssigned(this.gameObject)) {
      return;
    }

    if (!isObjectAssigned(this._body)) {
      let pos = this.gameObject.transform.getPosition();

      // TODO assign the body based on the object
      let width = 1;
      let height = 1;

      if (isSprite(this.gameObject)) {
        width = this.gameObject.getTexture().getWidth();
        height = this.gameObject.getTexture().getHeight();
      }

      this._body = Matter.Bodies.rectangle(pos.x, pos.y, width, height, {
        isStatic: this._isStatic
      });

      Matter.World.add(GameManager.activeScene.getPhysicsWorld(), [this._body]);

      let objScale = this.gameObject.transform.getScale();
      Matter.Body.scale(this._body, objScale.x, objScale.y);

      this.gameObject.transform.overridePositionGetter(function() {
        return {
          x: self._body.position.x,
          y: self._body.position.y
        };
      });

      this.gameObject.transform.overrideRotationGetter(function() {
        return self._body.angle;
      });
    }

    if (isObjectAssigned(this._mass)) {
      Matter.Body.setMass(this._body, this._mass);
    }

    if (isObjectAssigned(this._friction)) {
      this._body.friction = this._friction;
    }
  }

  //#endregion
}
