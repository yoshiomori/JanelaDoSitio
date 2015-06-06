function main(){
	var canvas = document.getElementById("screen");
	if (!canvas) {
		console.log("Failed to retrieve the <canvas> element");
		return;
	}
	canvas.width = window.outerWidth;
	canvas.height = window.outerHeight;
	var webGL = canvas.getContext("webgl");
	webGL.clearColor(0.0, 0.0, 0.0, 1.0);
	webGL.clear(webGL.COLOR_BUFFER_BIT);
};