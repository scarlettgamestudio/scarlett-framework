/**
 * Created by Luis on 23/12/2016.
 */

function stroke(color, size) {
    // stroke color
    this._color = color || Color.fromRGBA(0.0, 0.0, 0.0, 1.0);
    // stroke size
    this._size = size || 0.0;
}

stroke.prototype.getColor = function(){
    return this._color;
};

stroke.prototype.setColor = function(color){
    this._color.set(color.r, color.g, color.b, color.a);
};

stroke.prototype.setOpacity = function(alpha){

    var currentColor = this.getColor();

    this._color.set(currentColor.r, currentColor.g, currentColor.b, alpha);
};

stroke.prototype.getOpacity = function(){
    return this.getColor().a;
};

stroke.prototype.getSize = function(){
    return this._size;
};

stroke.prototype.setSize = function(size){
    this._size = size;
};

stroke.prototype.objectify = function () {
    return {
        color: this._color.objectify(),
        size: this.getSize()
    };
};

stroke.prototype.restore = function (data) {
    return {
        color: this._color.restore(data),
        size: data.size
    };
};