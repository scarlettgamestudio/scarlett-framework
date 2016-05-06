var settings = {
    target: "canvas"
};

var canvas;

var game = new Game(settings);
game.init();

var gameScene = new GameScene({
    name: "my game scene 1",
    game: game
});

var displayWidth = 1280.0;
var displayHeight = 720.0;
var halfWidth = displayWidth / 2;
var halfHeight = displayHeight / 2;
var gl = null;

var tex2D = new Texture2D("./sprite.png");
var textureShader = new TextureShader();


gameScene.initialize = function () {
    game.setVirtualResolution(displayWidth, displayHeight);

};

gameScene.update = function (delta) {

};

var useBatch = true;

gameScene.lateRender = function (delta) {

    gl = GameManager.renderContext.getContext();

    if(tex2D.isReady()) {

        var squareVertices = [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0
        ];

        var textureVertices = [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            0.0,  1.0,
            1.0,  0.0,
            1.0,  1.0
        ];

        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureVertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(textureShader.attributes.aTextureCoord);
        gl.vertexAttribPointer(textureShader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        for(var i = 0; i < 100; i ++) {
            var transformMatrix = mat4.create();
            mat4.identity(transformMatrix);
            mat4.translate(transformMatrix, transformMatrix, [10 * i, 10 * i, 0]);
            mat4.scale(transformMatrix, transformMatrix, [100, 100, 0]);

            gl.uniformMatrix4fv(textureShader.uniforms.uMatrix._location, false, game.getActiveCamera().getMatrix());
            gl.uniformMatrix4fv(textureShader.uniforms.uTransform._location, false, transformMatrix);

            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);

            gl.enableVertexAttribArray(textureShader.attributes.aVertexPosition);
            gl.vertexAttribPointer(textureShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

    }

    meter.tick();
};

game.changeScene(gameScene);



