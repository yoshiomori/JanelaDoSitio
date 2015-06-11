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
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
    window.requestAnimationFrame(render);
}

function main(){
	canvas = document.getElementById("screen");
	if (!canvas) {
		console.log("Failed to retrieve the <canvas> element");
		return;
	}
	gl = canvas.getContext("webgl");
	if (!gl){
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	setUpScreen();
	
	// Programa shader
	var VSHADER_SOURCE =
	"attribute vec4 a_Position;\n" +
	"attribute vec2 a_TexCoord;\n" +
	"varying vec2 v_TexCoord;\n" +
	"void main(){\n" +
	" gl_Position = a_Position;\n" +
	" v_TexCoord = a_TexCoord;\n" +
	"}\n";
	var FSHADER_SOURCE =
	"#ifdef GL_ES\n" +
	"precision mediump float;\n" +
	"#endif\n" +
	"uniform sampler2D u_Sampler;\n" +
	"varying vec2 v_TexCoord;\n" +
	"void main(){\n" +
	" gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n" +
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

	// Carregando dados dos vértices no programa
	var y = Math.sqrt(1 - 0.5 * 0.5) / 2;
	var verticesTexCoords = new Float32Array([
	 0.0,  y,   0.5, 0.5 + y,
	-0.5, -y,   0.0, 0.5 - y,
	 0.5, -y,   1.0, 0.5 - y
	]);
	var n = 3;
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer) {
		console.log("Failed to create the buffer object");
		return -1;
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
	var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
	var a_Position = gl.getAttribLocation(program, "a_Position");
	if (a_Position < 0) {
		console.log("Failed to get the storage location of a_Position");
		return -1;
	}
	gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
	gl.enableVertexAttribArray(a_Position);
	var a_TexCoord = gl.getAttribLocation(program, "a_TexCoord");
	if (a_TexCoord < 0) {
		console.log("FAiled to get the storage location of a_TexCoord");
		return -1;
	}
	gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
	gl.enableVertexAttribArray(a_TexCoord);
	
	// Iniciando texturas
	var texture = gl.createTexture();
	if (!texture) {
		console.log("Failed to create the texture object");
		return false;
	}
	var u_Sampler = gl.getUniformLocation(program, "u_Sampler");
	if (!u_Sampler) {
		console.log("Failed to get the storege location of u_Sampler");
		return false;
	}
	var image = new Image();
	if (!image) {
		console.log("Failed to create the image object");
		return false;
	}
	image.onload = function(){loadTexture(gl, n, texture, u_Sampler, image);};
	image.src = "sky.jpg";
	//render(n);
}

function loadTexture (gl, n, texture, u_Sampler, image) {
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D (gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler, 0);
	render(n);
}