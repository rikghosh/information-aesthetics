// initialize variables
var night, day;
var hourTwelve = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // define colors
  day = color(243, 144, 79); // orange
  night = color(59, 67, 113); // indigo
}

function draw() {
  
  if (hour() >= 12) {
    setGradient(0, 0, width, height, day, night); // adjust gradent direction for noon start
    hourTwelve = hour() - 12; // convert 24h format to 12h format
  } 
  
  else {
  setGradient(0, 0, width, height, night, day); // adjust gradient direction for midnight start
  hourTwelve = hour();
  };

  var h = map(hourTwelve, 0, 11, 0, windowWidth); // map 12h format hour from 0-11 to 0-window width 
  var m = map(minute(), 0, 59, 0, windowWidth); // map minutes from 0-59 to 0-window width
  var s = map(second(), 0, 59, 0, windowWidth); // map seconds from 0-59 to 0-window width
  
  
  // create moving squares for hour, second, and minute
  fill(50);
  stroke(50);
  rectMode(CENTER); // measure rectangle position from center instead of top left corner
  rect(s, windowHeight/4, 50, 50, 10); // create square displaying current second
  rect(m + s/60, windowHeight/2, 50, 50, 10); // create square displaying current minute (adjusted graduatlly every second)
  rect(h + s/3600, 3*windowHeight/4, 50, 50, 10); // create square displaying current hour (adjusted graduatlly every second)
}


// gradient code adapted from https://p5js.org/examples/color-linear-gradient.html
function setGradient(x, y, w, h, c1, c2) {
    for (var i = x; i <= x+w; i++) {
      var inter = map(i, x, x+w, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y+h);
    }
}