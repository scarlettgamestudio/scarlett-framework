import Vector2 from "./vector2";

/*
 Boundary Class
 */
export default class Boundary {
  //#region Constructors

  /**
     * Boundary structure
     * @param {Vector2} topLeft
     * @param {Vector2} topRight
     * @param {Vector2} bottomRight
     * @param {Vector2} bottomLeft
     * @constructor
     */
  constructor(topLeft, topRight, bottomRight, bottomLeft) {
    // public properties:
    this.topLeft = topLeft || new Vector2();
    this.topRight = topRight || new Vector2();
    this.bottomRight = bottomRight || new Vector2();
    this.bottomLeft = bottomLeft || new Vector2();
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static getMinMax(boundary, norm) {
    let probeA = boundary.topRight.dot(norm);
    let probeB = boundary.bottomRight.dot(norm);
    let probeC = boundary.bottomLeft.dot(norm);
    let probeD = boundary.topLeft.dot(norm);

    return {
      max: Math.max(probeA, probeB, probeC, probeD),
      min: Math.min(probeA, probeB, probeC, probeD)
    };
  }

  /**
     * Tests if two boundaries are overlapping each other
     * @param {Boundary} boundaryA
     * @param {Boundary} boundaryB
     * @returns {boolean} whether the boundaries overlap
     */
  static overlap(boundaryA, boundaryB) {
    // the following collision detection is based
    // on the separating axis theorem:
    // eslint-disable-next-line
    // http://www.gamedev.net/page/resources/_/technical/game-programming/2d-rotated-rectangle-collision-r2604
    let normA = boundaryA.getNormals();
    let normB = boundaryB.getNormals();

    let p1, p2, normNode, norm;
    for (let i = 0; i < 4; i++) {
      normNode = i >= 2 ? normB : normA;
      norm = i % 2 == 0 ? normNode.bottom : normNode.right;
      p1 = Boundary.getMinMax(boundaryA, norm);
      p2 = Boundary.getMinMax(boundaryB, norm);

      if (p1.max < p2.min || p2.max < p1.min) {
        return false;
      }
    }

    return true;
  }

  /**
     * Creates a boundary object based on the given 
     * vector and adds the specified bulk dimension
     * @param {Vector2} vec
     * @param bulk
     * @returns {Boundary} a boundary based on the given vector and bulk
     */
  static fromVector2(vec, bulk) {
    let halfBulk = bulk / 2.0;
    return new Boundary(
      new Vector2(vec.x - halfBulk, vec.y - halfBulk),
      new Vector2(vec.x + halfBulk, vec.y - halfBulk),
      new Vector2(vec.x + halfBulk, vec.y + halfBulk),
      new Vector2(vec.x - halfBulk, vec.y + halfBulk)
    );
  }

  //#endregion

  /**
  * Returns all vertices in an array
  * @returns {Array.<{topLeft: Vector2, topRight: 
              Vector2, bottomRight: Vector2, bottomLeft: Vector2}>}
  */
  getVertices() {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }

  /**
     * Calculate the normals of each boundary side and 
     * returns a object mapped with the values of each side
     * @returns {{top: Vector2, right: Vector2, bottom: Vector2, left: Vector2}}
     */
  getNormals() {
    return {
      top: new Vector2(
        this.topRight.x - this.topLeft.x,
        this.topRight.y - this.topLeft.y
      ).normalLeft(),
      right: new Vector2(
        this.bottomRight.x - this.topRight.x,
        this.bottomRight.y - this.topRight.y
      ).normalLeft(),
      bottom: new Vector2(
        this.bottomLeft.x - this.bottomRight.x,
        this.bottomLeft.y - this.bottomRight.y
      ).normalLeft(),
      left: new Vector2(
        this.topLeft.x - this.bottomLeft.x,
        this.topLeft.y - this.bottomLeft.y
      ).normalLeft()
    };
  }

  /**
     * Tests if the boundary is overlapping another
     * @param other
     * @returns {boolean}
     */
  overlapsWith(other) {
    return Boundary.overlap(this, other);
  }

  //#endregion
}
