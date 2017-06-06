/**
 * PrimitiveBatch class for on demand direct drawing
 */
class PrimitiveBatch {

    //#region Constructors

    /**
     *
     * @param game
     */
    constructor(game) {
        if (!isGame(game)) {
            throw error("Cannot create primitive render, the Game object is missing from the parameters");
        }

        // public properties:


        // private properties:
        this._game = game;
        this._gl = game.getRenderContext().getContext();
        this._primitiveShader = new PrimitiveShader();
        this._vbo = this._gl.createBuffer();

        this._rectangleVertexData = [];
        this._rectangleColorData = [];
        this._rectangleCount = 0;

        this._lineArrayCount = 0;
        this._lineVertexData = [];

        this._transformMatrix = new Matrix4();
        this._rectangleData = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]);
    }

    //#endregion

    //#region Methods

    unload() {
        this._gl.deleteBuffer(this._vbo);

        this._primitiveShader.unload();
    }

    begin() {
        this.clear();
    }

    clear() {
        // rectangle data
        this._rectangleVertexData = [];
        this._rectangleColorData = [];
        this._rectangleCount = 0;

        // lines data
        this._lineVertexData = [];
        this._lineArrayCount = 0;
    }

    flushRectangles() {
        if (this._rectangleCount === 0) {
            // nothing to do..
            return;
        }

        let gl = this._gl;
        let cameraMatrix = this._game.getActiveCamera().getMatrix();

        this._game.getShaderManager().useShader(this._primitiveShader);

        // TODO: review this.. not batched at all!
        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, this._rectangleData, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
        gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        // set uniforms
        gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, cameraMatrix);

        for (let i = 0; i < this._rectangleCount; i++) {
            this._transformMatrix.identity();
            this._transformMatrix.translate([this._rectangleVertexData[i].x, this._rectangleVertexData[i].y, 0]);
            this._transformMatrix.scale([this._rectangleVertexData[i].width, this._rectangleVertexData[i].height, 0])

            gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, this._transformMatrix.asArray());
            gl.uniform4f(this._primitiveShader.uniforms.uColor._location,
                this._rectangleColorData[i].r, this._rectangleColorData[i].g, this._rectangleColorData[i].b, this._rectangleColorData[i].a);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }

    flushLines() {
        if (this._lineVertexData.length === 0) {
            // nothing to do..
            return;
        }

        let gl = this._gl;

        // TODO: not all implementations support this, to check again in a near future..
        // gl.lineWidth(thickness);

        this._game.getShaderManager().useShader(this._primitiveShader);

        // vbo buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._lineVertexData), gl.STATIC_DRAW);

        gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, this._gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);

        gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexColorPosition, 4, this._gl.FLOAT, false, 24, 8);
        gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexColorPosition);

        this._transformMatrix.identity();

        // set uniforms
        gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
        gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, this._transformMatrix.asArray());
        //gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);

        gl.drawArrays(gl.LINES, 0, this._lineArrayCount);
    }

    storeRectangle(rectangle, color) {
        this._rectangleColorData.push(color);
        this._rectangleVertexData.push(rectangle);
        this._rectangleCount++;
    }

    storeLine(vectorA, vectorB, color) {
        // Note: DO NOT use any kind of javascript concatenation mechanism here! it slows down things considerably
        this._lineVertexData.push(vectorA.x);
        this._lineVertexData.push(vectorA.y);
        this._lineVertexData.push(color.r);
        this._lineVertexData.push(color.g);
        this._lineVertexData.push(color.b);
        this._lineVertexData.push(color.a);

        this._lineVertexData.push(vectorB.x);
        this._lineVertexData.push(vectorB.y);
        this._lineVertexData.push(color.r);
        this._lineVertexData.push(color.g);
        this._lineVertexData.push(color.b);
        this._lineVertexData.push(color.a);

        this._lineArrayCount += 2;
    }

    //#endregion

}