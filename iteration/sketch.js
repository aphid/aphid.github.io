//this initializes an array.  remember arrays from your poems?
var points = [];

//this runs once when the sketch is played.
function setup() {
  //creates a canvas, the numbers are pixels.  
  //remember, 72 pixels per inch on screen
  let canvas = createCanvas(1000, 1000);
  canvas.parent('#sketch-holder');

  //background color, R G B
  background(253, 245, 230);
  //stroke color (the color of lines and outlines) in grayscale
  stroke(19);
  //fill color
  fill(19);

  //this creates a function called randomPoint with no inputs.
  function randomPoint() {
    //creates random numbers between the specified range
    //floor rounds them down
    var x = floor(random(500, 1000));
    var y = floor(random(1, 500));
    //returns an object with properties called x and y set to above
    return {
      "x": x,
      "y": y
    }
  }

  //this sets up a loop that runs as many times as the number in the middle
  for (var i = 0; i < 5000; i++) {
    //loads a random point.
    var aPoint = randomPoint();
    //puts that point object into the array we set on line 1.
    points.push(aPoint);

    //sets stroke and fill color to random RGB values
    stroke(random(0, 255), random(0, 255), random(0, 255));
    fill(random(0, 255), random(0, 255), random(0, 255));
		//draw an ellipse, 5 pixels in diameter at x;y
    ellipse(aPoint.x, aPoint.y, 5);
  } //end of for loop
  
  //another loop, which runs for as many points that exist, minus one
  for (var p = 0; p < points.length - 1; p++) {
    //random RGB value stroke
    stroke(random(0, 255), random(0, 255), random(0, 255));
    
    //load point p into 'source'
    var source = points[p];
		//load point p+1 into 'destination'
    var destination = points[p + 1];
    //draw a line between source and destination xy pairs
    line(source.x, source.y, destination.x, destination.y);

  } //end of for

} //end of setup

function draw() {


}