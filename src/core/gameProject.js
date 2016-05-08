/**
 * GameProject class
 */
function GameProject (name) {
	// public properties:
	this.name = name;
}

GameProject.prototype.toJSON = function() {
	return {
		name: this.name
	};
};

