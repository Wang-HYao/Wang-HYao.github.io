"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = 1;
var speed = 50;

function changeDir(){
	direction *= -1;
}



function initRotSquare(){
	canvas = document.getElementById( "rot-canvas" );
	gl = WebGLUtils.setupWebGL( canvas, "experimental-webgl" );
	if( !gl ){
		alert( "WebGL isn't available" );
	}

	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

	var program = initShaders( gl, "rot-v-shader", "rot-f-shader" );
	gl.useProgram( program );

	var vertices = [
		 -0.25,-0.25,0,
		 0.25,  -0.5,  0,
		 -0.25, -0.5,  0,
		 
		 0.25,-0.25,0,
		 -0.25,-0.25,0,
		 0.25, -0.5,  0,
		 
		 0,0.5,0,
		 -0.5,-0.25,0,
		 0.5,-0.25,0,
		 0,0.8,0,
		 -0.5,0.05,0,
		 0.5,0.05,0,
	];
	var colors = [
		184/255,134/255,11/255, 1.0,
		184/255,134/255,11/255, 1.0,
		184/255,134/255,11/255, 1.0,
		 184/255,134/255,11/255, 1.0,
		184/255,134/255,11/255, 1.0,
		184/255,134/255,11/255, 1.0,
		 0.0, 1, 0.0, 1.0,
		 0.0, 1, 0.0, 1.0,
		 0.0, 1, 0.0, 1.0,
		 0.0, 1, 0.0, 1.0,
		 0.0, 1, 0.0, 1.0,
		 0.0, 1, 0.0, 1.0,
	];
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	
	// Load the data into the GPU
	var cbufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
	
	// Associate external shader variables with data buffer
	var cPosition = gl.getAttribLocation( program, "cPosition" );
	gl.vertexAttribPointer( cPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( cPosition );

	thetaLoc = gl.getUniformLocation( program, "theta" );

	document.getElementById( "speedcon" ).onchange = function( event ){
		speed = 100 - event.target.value;
	}

	renderSquare();
}

function renderSquare(){
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	// set uniform values
	theta += direction * 0.1;
	
	gl.uniform1f( thetaLoc, theta );

	gl.drawArrays( gl.TRIANGLES, 0, 12 );

	// update and render
	setTimeout( function(){ requestAnimFrame( renderSquare ); }, speed );
}