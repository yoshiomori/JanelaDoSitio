var canvas;
var gl;

function setUpScreen(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}

function main(){
	canvas = document.getElementById("screen");
	if (!canvas) {
		console.log("Failed to retrieve the <canvas> element");
		return;
	}
	gl = canvas.getContext("webgl");
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	if (!gl){
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	setUpScreen();
	gl.clear(gl.COLOR_BUFFER_BIT);
};