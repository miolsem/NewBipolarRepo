(function(window) {
Placement_Symbol = function() {
	this.initialize();
}
Placement_Symbol._SpriteSheet = new createjs.SpriteSheet({images: ["Untitled-2.png"], frames: [[0,0,720,481,0,360,239.55],[0,481,720,481,0,360,239.55]]});
var Placement_Symbol_p = Placement_Symbol.prototype = new createjs.BitmapAnimation();
Placement_Symbol_p.BitmapAnimation_initialize = Placement_Symbol_p.initialize;
Placement_Symbol_p.initialize = function() {
	this.BitmapAnimation_initialize(Placement_Symbol._SpriteSheet);
	this.paused = false;
}
window.Placement_Symbol = Placement_Symbol;
}(window));

