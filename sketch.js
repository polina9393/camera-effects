var video;
var slider;
var slider2;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.hide();
  noStroke();

  ////////////
  //sliders//
  //////////
  slider = createSlider(0, 2, 0, 1);
  slider.position(680, 100);
  slider.style('width', '80px');

  slider2 = createSlider(0, 9, 0, 1);
  slider2.position(680, 200);
  slider2.style('width', '80px');

}



function draw() {

  var box = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
  var boxWidth = box;
  var boxHeight = box;
  var v2 = slider2.value();
  boxWidth = box[v2];
  boxHeight = box[v2];


  background(51);
  video.loadPixels();

  //////////////////
  //Pixel binning//
  ////////////////
  var tot = boxWidth * boxHeight;
  for (var x = 0; x < video.width; x += boxWidth) {
    for (var y = 0; y < video.height; y += boxHeight) {
      var red = 0,
        green = 0,
        blue = 0;


      for (var i = 0; i < boxWidth; i++) {
        for (var j = 0; j < boxHeight; j++) {
          var index = ((x + i) + ((y + j) * video.width)) * 4;
          red += video.pixels[index + 0];
          green += video.pixels[index + 1];
          blue += video.pixels[index + 2];
        }
      }

      var c = color(red / tot, green / tot, blue / tot);

      var mode = [c, replace8bit(c), replace4bit(c)];

      var v = slider.value();

      fill(mode[v]);
      stroke(50);
      ellipse(x, y, boxWidth, boxHeight);

    }
  }
}



///////////////////////
//8 bit = 256 colours//
/////////////////////

function replace8bit(c) {

  var r = int(red(c) / (255 / 8)) * (255 / 8);
  var g = int(green(c) / (255 / 8)) * (255 / 8);
  var b = int(green(c) / (255 / 4)) * (255 / 4);
  return color(r, g, b);
}




//////////////////////
//4 bit = 16 colours//
////////////////////
//3 bit is consist of red, geen and blue colours. By mixturasing these colours we are getting 8 colours.
//The last bit gives us intensity of 8 these colours.Overall,3 bits=8 colours,1bit=intesity of these 8colours.
var q = 3;

function replace4bit(c) {
  var colors = [
    color(0, 0, 0), //black
    color(85, 85, 85), // gray
    color(0, 0, 170), // blue
    color(85, 85, 255), // light blue
    color(0, 170, 0), // green
    color(85, 255, 85), // light green
    color(0, 170, 170), // cyan
    color(85, 255, 255), // light cyan
    color(170, 0, 0), // red
    color(255, 85, 85), // light red
    color(170, 0, 170), // magenta
    color(255, 85, 255), // light magenta
    color(170, 85, 0), // brown // #AA5500
    color(255, 255, 85), // yellow
    color(170, 170, 170), // light gray
    color(255, 255, 255) // white (high intensity)
  ];

  //finding the closest color from the camera(Euclidean distance)///////////
  var r1 = int(red(c));
  var g1 = int(green(c));
  var b1 = int(blue(c));

  var dmin = 0;
  var k = 0;
  for (var i = 0; i < colors.length; i++) {
    var o2 = colors[i];

    var r2 = red(o2);
    var g2 = green(o2);
    var b2 = blue(o2);

    var d = (sq(r2 - r1)) * 0.3 + (sq(g2 - g1)) * 0.59 + (sq(b2 - b1)) * 0.11;

    if (i === 0) {
      dmin = d;
    }
    if (d < dmin) {
      dmin = d;
      k = i;
    }
  }

  return (colors[k]);
}
