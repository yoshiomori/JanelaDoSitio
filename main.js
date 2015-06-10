var canvas;
var gl;

function setUpScreen(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}

function initShader(type, source, program){
	var shader = gl.createShader(type);
	if (shader == null) {
		console.log("unable to create shader object");
		return null;
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	gl.attachShader(program, shader);
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, 1);
    window.requestAnimationFrame(render);
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
	
	// Programa shader
	var VSHADER_SOURCE =
	"void main(){\n"+
	" gl_Position = vec4(0,0,0,1);\n"+
	" gl_PointSize = 10.0;\n"+
	"}\n";
	var FSHADER_SOURCE =
	"void main(){\n"+
	" gl_FragColor = vec4(1,0,0,1);\n"+
	"}\n";
	var program = gl.createProgram();
	var vertexShader = initShader(gl.VERTEX_SHADER, VSHADER_SOURCE, program);
	var fragmentShader = initShader(gl.FRAGMENT_SHADER, FSHADER_SOURCE, program);
	gl.linkProgram(program);
	var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (!linked) {
		var error = gl.getProgramInfoLog(program);
		console.log("Failed to link program: " + error);
		gl.deleteProgram(program);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		return null;
	}
	gl.useProgram(program);
	render();
}