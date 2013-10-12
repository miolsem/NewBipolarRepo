(function(window) {
Placement = function() {
	this.initialize();
}
Placement._SpriteSheet = new createjs.SpriteSheet({images: ["Arrow Button.png"], frames: [[0,0,720,481,0,360,239.55],[0,481,720,481,0,360,239.55]]});
var Placement_p = Placement.prototype = new createjs.BitmapAnimation();
Placement_p.BitmapAnimation_initialize = Placement_p.initialize;
Placement_p.initialize = function() {
	this.BitmapAnimation_initialize(Placement._SpriteSheet);
	this.paused = false;
}
window.Placement = Placement;
}(window));

