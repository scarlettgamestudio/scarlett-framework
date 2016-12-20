/**
 * Created by Luis on 16/12/2016.
 */
/**
 * SpriteBatch class
 */
AttributeDictionary.inherit("text", "gameobject");

function Text(params) {

    params = params || {};
    params.name = params.name || "Sprite";

    GameObject.call(this, params);

    // private properties
    this._uid = generateUID();
    //this._source = image;
    this._gl = GameManager.renderContext.getContext();

    this._vertexBuffer = this._gl.createBuffer();
    this._textShader = new TestShader();

    this._trianglePositions = new Float32Array([
        0, 0,
        0, 0.5,
        0.7, 0,
    ]);
}

inheritsFrom(Text, GameObject);

Text.prototype.render = function (delta, spriteBatch) {

    if (!this.enabled) {
        return;
    }

    var gl = this._gl;

    GameManager.activeGame.getShaderManager().useShader(this._textShader);

    // position buffer attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._trianglePositions, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._textShader.attributes.a_position);

    gl.vertexAttribPointer(this._textShader.attributes.a_position, 2, gl.FLOAT, false, 0, 0);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);

    // parent render function:
    GameObject.prototype.render.call(this, delta, spriteBatch);
};

Text.prototype.unload = function () {
    //gl.deleteBuffer(this._vertexBuffer);
    //gl.deleteBuffer(this._texBuffer);

    //this._textureShader.unload();
};