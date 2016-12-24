/**
 * Created by Luis on 23/12/2016.
 */

function Stroke(color, size) {

    // stroke color
    this._color = color || Color.fromRGBA(0.0, 0.0, 0.0, 1.0);
    // stroke size
    this._size = size || 0.0;
}

Stroke.prototype.getColor = function(){
    return this._color;
};

Stroke.prototype.setColor = function(color){
    this._color.set(color.r, color.g, color.b, color.a);
};

Stroke.prototype.setOpacity = function(alpha){

    var currentColor = this.getColor();

    this._color.set(currentColor.r, currentColor.g, currentColor.b, alpha);
};

Stroke.prototype.getOpacity = function(){
    return this.getColor().a;
}

Stroke.prototype.getSize = function(){
    return this._size;
};

Stroke.prototype.setSize = function(size){
    this._size = size;
};

Stroke.prototype.objectify = function () {
    return {
        color: this._color.objectify(),
        size: this.getSize()
    };
};

Stroke.prototype.restore = function (data) {
    return {
        color: this._color.restore(data),
        size: data.size
    };
};