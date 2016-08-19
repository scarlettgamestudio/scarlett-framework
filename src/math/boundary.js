/**
 * Boundary structure
 * @param topLeft
 * @param topRight
 * @param bottomRight
 * @param bottomLeft
 * @constructor
 */
function Boundary(topLeft, topRight, bottomRight, bottomLeft) {
    // public properties:
    this.topLeft = topLeft || 0;
    this.topRight = topRight || 0;
    this.bottomRight = bottomRight || 0;
    this.bottomLeft = bottomLeft || 0;
}

/**
 * Calculate the normals of each boundary side and returns a object mapped with the values of each side
 */
Boundary.prototype.getNormals = function() {
    return {
        top: new Vector2(this.topRight.x - this.topLeft.x, this.topRight.y - this.topLeft.y).normalLeft(),
        right: new Vector2(this.bottomRight.x - this.topRight.x, this.bottomRight.y - this.topRight.y).normalLeft(),
        bottom: new Vector2(this.bottomLeft.x - this.bottomRight.x, this.bottomLeft.y - this.bottomRight.y).normalLeft(),
        left: new Vector2(this.topRight.x - this.bottomLeft.x, this.topRight.y - this.bottomLeft.y).normalLeft()
    }
};