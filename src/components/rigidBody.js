function RigidBody (params) {
	params = params || {};

	// public properties
	this.gameObject = null;

	// private properties
	this._isStatic = params.static || false;
	this._mass = params.mass || null;
	this._friction = params.friction || null;
	this._body = null;

}

RigidBody.prototype._sync = function() {
	var self = this;

	if(!isObjectAssigned(this.gameObject)) {
		return;
	}

	if(!isObjectAssigned(this._body)) {
		var pos = this.gameObject.transform.getPosition();

		// TODO assign the body based on the object
		var width = 1,
			height = 1;
		
		if(isSprite(this.gameObject)) {
			width = this.gameObject.getTexture().getWidth();
			height = this.gameObject.getTexture().getHeight();
		}

		this._body = Matter.Bodies.rectangle(pos.x, pos.y, width, height,
			{
				isStatic: this._isStatic
			});

		Matter.World.add(GameManager.activeScene.getPhysicsWorld(), [this._body]);

		var objScale = this.gameObject.transform.getScale();
		Matter.Body.scale(this._body, objScale.x, objScale.y);

		this.gameObject.transform.overridePositionGetter(function() {
			return {
				x: self._body.position.x,
				y: self._body.position.y
			}
		});

		this.gameObject.transform.overrideRotationGetter(function() {
			return self._body.angle;
		});
	}

	if(isObjectAssigned(this._mass)) {
		Matter.Body.setMass(this._body, this._mass);
	}

	if(isObjectAssigned(this._friction)) {
		this._body.friction = this._friction;
	}
};

RigidBody.prototype.setMass = function(mass) {
	this._mass = mass;
	Matter.Body.setMass(this._body, this._mass);
};

RigidBody.prototype.getMass = function() {
	return this.mass;
};

RigidBody.prototype.setGameObject = function(gameObject) {
	this._sync();
};

RigidBody.prototype.onGameObjectDetach = function() {
	this.gameObject.transform.clearPositionGetter();
	this.gameObject.transform.clearScaleGetter();
	this.gameObject.transform.clearRotationGetter();
};

RigidBody.prototype.onGameObjectPositionUpdated = function(value) {
	if(isObjectAssigned(this._body)) {
		Matter.Body.setPosition(this._body, value);
	}
};

RigidBody.prototype.onGameObjectRotationUpdated = function(value) {
	if(isObjectAssigned(this._body)) {
		Matter.Body.setAngle(this._body, value);
	}
};

RigidBody.prototype.onGameObjectScaleUpdated = function(value) {
	if(isObjectAssigned(this._body)) {
		Matter.Body.scale(this._body, value.x, value.y);
	}
};

RigidBody.prototype.unload = function() {
	// TODO: do this
};