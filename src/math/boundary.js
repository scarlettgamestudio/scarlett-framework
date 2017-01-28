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
    this.topLeft = topLeft || new Vector2();
    this.topRight = topRight || new Vector2();
    this.bottomRight = bottomRight || new Vector2();
    this.bottomLeft = bottomLeft || new Vector2();
}

/**
 * Returns all vertices in an array (topLeft, topRight, bottomRight, bottomLeft)
 */
Boundary.prototype.getVertices = function () {
    return [
        this.topLeft,
        this.topRight,
        this.bottomRight,
        this.bottomLeft
    ];
};

/**
 * Calculate the normals of each boundary side and returns a object mapped with the values of each side
 */
Boundary.prototype.getNormals = function () {
    return {
        top: new Vector2(this.topRight.x - this.topLeft.x, this.topRight.y - this.topLeft.y).normalLeft(),
        right: new Vector2(this.bottomRight.x - this.topRight.x, this.bottomRight.y - this.topRight.y).normalLeft(),
        bottom: new Vector2(this.bottomLeft.x - this.bottomRight.x, this.bottomLeft.y - this.bottomRight.y).normalLeft(),
        left: new Vector2(this.topLeft.x - this.bottomLeft.x, this.topLeft.y - this.bottomLeft.y).normalLeft()
    }
};

/**
 * Tests if the boundary is overlapping another
 * @param other
 * @returns {boolean}
 */
Boundary.prototype.overlapsWith = function (other) {
    return Boundary.overlap(this, other);
};

/**
 * Tests if two boundaries are overlapping each other
 * @param boundaryA
 * @param boundaryB
 * @returns {boolean}
 */
Boundary.overlap = function (boundaryA, boundaryB) {
    // the following collision detection is based on the separating axis theorem:
    // http://www.gamedev.net/page/resources/_/technical/game-programming/2d-rotated-rectangle-collision-r2604
    var normA = boundaryA.getNormals();
    var normB = boundaryB.getNormals();

    function getMinMax(boundary, norm) {
        var probeA = boundary.topRight.dot(norm);
        var probeB = boundary.bottomRight.dot(norm);
        var probeC = boundary.bottomLeft.dot(norm);
        var probeD = boundary.topLeft.dot(norm);

        return {
            max: Math.max(probeA, probeB, probeC, probeD),
            min: Math.min(probeA, probeB, probeC, probeD)
        }
    }

    var p1, p2, normNode, norm;
    for (var i = 0; i < 4; i++) {
        normNode = i >= 2 ? normB : normA;
        norm = i % 2 == 0 ? normNode.bottom : normNode.right;
        p1 = getMinMax(boundaryA, norm);
        p2 = getMinMax(boundaryB, norm);

        if (p1.max < p2.min || p2.max < p1.min) {
            return false;
        }
    }

    return true;
};

/**
 * Creates a boundary object based on a given vector and adds the specified bulk dimension
 * @param vec
 * @param bulk
 */
Boundary.fromVector2 = function (vec, bulk) {
    var halfBulk = bulk / 2.0;
    return new Boundary(
        new Vector2(vec.x - halfBulk, vec.y - halfBulk),
        new Vector2(vec.x + halfBulk, vec.y - halfBulk),
        new Vector2(vec.x + halfBulk, vec.y + halfBulk),
        new Vector2(vec.x - halfBulk, vec.y + halfBulk)
    )
};