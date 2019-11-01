// Complex Number Calculation Functions

var cAdd = function(a, b) {
  var r = a.r + b.r;
  var i = a.i + b.i;
  return { r: r, i: i };
};

var cMul = function(a, b) {
  var r = a.r * b.r - a.i * b.i;
  var i = ((a.r + a.i) * (b.r + b.i)) - (a.r * b.r) - (a.i * b.i);
  return { r: r, i: i };
};

// Find number of iterations that a complex number gets to when it blows up
var calculateIterations = function(z, c, i=0) {
  var result = cAdd(cMul(z, z), c); 
  if (i === 300) {
    return i;
  } else if ((result.r**2 + result.i**2) > 4) {
    return i;
  } else {
    return calculateIterations(result, c, i + 1);
  }
};

// Render the mandlebort set onto the canvas
var render = function() {
  // Fetch all the data from the canvas and form
  var canvas = document.getElementById('screen');
  
  var centerReal = parseFloat(document.getElementById("center_real").value);
  var centerImaginary = parseFloat(document.getElementById("center_imaginary").value);
  var scale = parseInt(document.getElementById("scale").value);
  var width = parseInt(canvas.width);
  var height = parseInt(canvas.height);

  var increment = 1 / scale;

  var originReal = centerReal - ( (width / scale) / 2 ); 
  var originImaginary = centerImaginary - ( (height / scale) / 2);
  
  var ctx = canvas.getContext('2d');
  var imageData = ctx.createImageData(width, height);
  var data = imageData.data;

  // Initialise some variables for the main calculation and render
  var i;
  var j;
  var currentImaginary;
  var currentReal;
  var current;
  var iterationCount;
  var r;
  var g;
  var b;
  var d;

  // Go through each co-ordinate on the canvas
  for (i = 0; i < height; i++) {
    currentImaginary = originImaginary + i*increment;
    for (j = 0; j < width; j++) {
      // Find the complex number for the co-ordinate
      currentReal = originReal + j*increment;
      current = { r: currentReal, i: currentImaginary };

      // Find the iteration count for the complex number
      iterationCount = calculateIterations({ r: 0, i: 0 }, current);

      // Set the colour parameters based on the iteration count
      if (iterationCount < 100) {
        r = 0;
        g = 0;
        b = 256 * (iterationCount % 100) / 100
      } else if (iterationCount < 200) {
        r = 0;
        g = 256 * (iterationCount % 100) / 100
        b = 0;
      } else if (iterationCount < 300) {
        r = 256 * (iterationCount % 100) / 100
        g = 0;
        b = 0;
      } else {
        r = 0;
        g = 0;
        b = 0;
      }

      // Push the color data onto the canvas image data
      d = (i * width * 4) + (j * 4);  
      data[d] = r;
      data[d+1] = g;
      data[d+2] = b;
      data[d+3] = 255;
    }
  }

  // Push the image data onto the canvas
  ctx.putImageData(imageData, 0, 0);
};

document.addEventListener("DOMContentLoaded", function(event) {
  // Render on load
  render();

  // Render when submit button is clicked
  var submitButton = document.getElementById("submit");
  submitButton.addEventListener("click", function(event) {
    render();
    event.preventDefault();
    return false;
  });
});

