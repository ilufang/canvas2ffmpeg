(function() {
// Timeline control
var frame = 0, frameCount = 3 * 30;

// Canvas Size
var cx = 1920, cy = 1080;

/**
 *	Initialization
 *
 *	Do anything that you need before drawing the first frame
 *	Such as clearing the canvas, initializing variables, etc
 */
var init = function(canvas) {
	frame = 0;
}

/**
 *	Drawing
 *
 *	For each frame, this function will be called.
 *	Draw the next frame on the canvas. The canvas contains the image of the previous frame
 *	You may want to keep track of the frame number yourself
 *
 *	By default, the animations runs at 30 fps on a 1920x1080 canvas (see variable cx and cy)
 *
 *	Return false when you want to end the movie
 */
var draw = function(canvas) {
	// Get the canvas context to draw on
	var ctx = canvas.getContext('2d');

	if (frame > frameCount) {
		// End of animation
		return false;
	}

	// Drawing begins, clear canvas first
	ctx.clearRect(0, 0, cx, cy);
	ctx.fillStyle = "#fff";
	ctx.fillRect(0,0,cx,cy);

	// TODO: insert drawing code here...
	ctx.strokeStyle = '#6cf';
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.moveTo(cx * frame / frameCount, 0);
	ctx.lineTo(cx * frame / frameCount, cy);
	ctx.closePath();
	ctx.stroke();

	// Increments, then return true to let the animation continue
	frame++;
	return true;
}

// Exports
window.Animator = {
	init: init,
	draw: draw
}

})();
