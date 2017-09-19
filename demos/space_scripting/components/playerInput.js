class PlayerInput extends SC.Script {
  constructor() {
    super();

    // public properties
    this.strengthVertical = 400;
    this.strengthHorizontal = 200;
    this.fallback = 125;

    // private
    this._offsetBreakpoint = 1280 - 80;
  }

  update(delta) {
    let keyboard = Keyboard;
    let directionHorizontal = 0;
    let directionVertical = 0;

    if (keyboard.isKeyDown(Keys.RightArrow) || keyboard.isKeyDown(Keys.D)) {
      directionHorizontal = 1;

    } else if (keyboard.isKeyDown(Keys.LeftArrow) || keyboard.isKeyDown(Keys.A)) {
      directionHorizontal = -1;
    }

    if (keyboard.isKeyDown(Keys.UpArrow) || keyboard.isKeyDown(Keys.W)) {
      directionVertical = -1;

    } else if (keyboard.isKeyDown(Keys.DownArrow) || keyboard.isKeyDown(Keys.S)) {
      directionVertical = 1;
    }

    this.transform.translate(
      this.strengthHorizontal * directionHorizontal * delta,
      this.strengthVertical * directionVertical * delta
    );

    if (directionHorizontal === 0 && this.transform.getPosition().x > -this._offsetBreakpoint) {
      this.transform.translate(this.fallback * delta * -1, 0);

      if (this.transform.getPosition().x < -this._offsetBreakpoint) {
        this.transform.setPosition(-this._offsetBreakpoint, this.transform.getPosition().y);
      }
    }
  }
}

SC.addScript("playerInput", PlayerInput);
