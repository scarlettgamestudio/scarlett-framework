var img = ImageLoader.loadImage("sprite.png", function (response) {
    // alert(response.isSuccessful());
});
img = ImageLoader.loadImage("sprite.png", function (response) {
    //alert(response.isSuccessful());
});

var settings = {
    target: "canvas"
};

var canvas;

var game = new Game(settings);
game.init();

var gameScene = new GameScene({
    name: "my game scene 1"
});

var trianglesColorBuffer;
var primitiveShader;
var trianglesVerticeBuffer;
var gl;
var angle = 0.0;
var mvMatrix = mat4.create(),
    pMatrix = mat4.create();
var displayWidth;
var displayHeight;

gameScene.initialize = function () {
    canvas = document.getElementById("canvas");

     displayWidth  = canvas.clientWidth;
     displayHeight = canvas.clientHeight;
    canvas.width  = displayWidth;
    canvas.height = displayHeight;

    game.setVirtualResolution(displayWidth, displayHeight);

    primitiveShader = new PrimitiveShader();
    gl = GameManager.renderContext.getContext();

    var triangleVerticeColors = [
        0.0, 1.0, 0.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
    ];

    trianglesColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticeColors), gl.STATIC_DRAW);

    var triangleVertices = [
        0.0, displayHeight, 0.0,
        0.0, 0.0, 0.0,
        displayWidth, 0.0, 0.0
    ];

    trianglesVerticeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
};
var mv = 0, mvy = 0;
gameScene.preRender = function (delta) {
    //mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.ortho(pMatrix, 0, displayWidth, 0, displayHeight, 0.0, 100);


    mat4.identity(mvMatrix);
    //var translation = vec3.create();
    //vec3.set(translation, mv, 0.0, -1.0);
    mat4.translate(mvMatrix, mvMatrix, [mv, mvy, 0.0]);

    //mv += delta / 600.0;
    //mvy += delta / 600.0;

    // do stuff here:
    //console.log("hello " + this.name);
    var vertexPositionAttribute = gl.getAttribLocation(primitiveShader.getProgram(), "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    var vertexColorAttribute = gl.getAttribLocation(primitiveShader.getProgram(), "aColor");
    gl.enableVertexAttribArray(vertexColorAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(gl.getUniformLocation(primitiveShader.getProgram(), "projectionMatrix"), false, pMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(primitiveShader.getProgram(), "translationMatrix"), false, mvMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

game.changeScene(gameScene);



