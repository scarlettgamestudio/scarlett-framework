SetterDictionary.addRule("vector4", ["x", "y", "z", "w"]);

/**
 * Vector4 Class for tri dimensional point references
 */
class Vector4 {

    //#region Constructors

    constructor(x, y, z, w) {
        // just because they 'should' be declared here
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.w = 0;

        this.set(x, y, z, w);
    }


    //#endregion

    //#region Methods

    //#region Static Methods

    static restore(data) {
        return new Vector4(data.x, data.y, data.z, data.w);
    }

    //#endregion

    set(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w || 0;
    }

    objectify() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
            w: this.w
        };
    }

    equals(obj) {
        return (obj.x === this.x && obj.y === this.y && obj.z === this.z && obj.w === this.w);
    }

    unload() {

    }

    //#endregion

}
