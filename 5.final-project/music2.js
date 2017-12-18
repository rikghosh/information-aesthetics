var wave, envelope;
var scaleArray = [];
var note = 0;

var times = [];
var notes = [];
var table;

var timesx = [];
var notesy = [];
var largex = [];
var largey = [];

var playmode = true;

var noteconv = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
var colorwheel = ["#EF3C42", "#4DAECF", "#F4AA2F", "#3438BD", "#FFFF2D", "#C32A94", "#53C025", "#F2823A", "#3F77C4", "#FAD435", "#7328B6", "#A7D52A"];
var measkeys = [7, 0, 2, 7 , 4, 7, 2, 4, 7, 2, 4, 9, 11, 4, 2, 7, 0, 2, 7, 9, 2, 2, 2, 2, 7, 7, 9, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 7, 2, 2, 7]

var opacities = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165]

var c;
var opacity;

function preload() {
    table = loadTable("trial2.csv", "csv", "header");
    garamond = loadFont("adobegaramond.otf");
    garamonditalic = loadFont("garamonditalic.ttf");
}

function setup() {
  createCanvas(windowWidth*4, windowHeight);
  textFont(garamond);

    
  for (var i = 0; i < table.getColumn(0).length; i += 2) {
        times.push(table.getColumn(0)[i]);
        notes.push(table.getColumn(1)[i]);
  }
    
  for (var i = 0; i < notes.length; i ++) {
      notes[i] = parseInt(notes[i]) + 12;
      scaleArray.push(notes[i]);
  }
    
  wave = new p5.SinOsc();

  // Instantiate the envelope
  envelope = new p5.Env();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  wave.start();
  noStroke();
    
  // map x and y positions of notes on screen
    for (var i = 0; i < times.length; i ++) {
        timesx.push(map(i, 0, times.length, 48, width - 20));
        notesy.push(map(notes[i], min(notes), max(notes), 3*height/8 + height/2, 3*height/8));
        largex.push(map(i, 0, times.length, 50,  1218));
        largey.push(map(notes[i], min(notes), max(notes), 225, 200));
    }
    
    console.log(min(notes));
    
    noStroke();
    
//    for (var i = 0; i < timesx.length; i ++) {
//        var measpos = i%16;
//        var meas = Math.floor(i/16);
//        var keypos = ((notes[i] % 12) - measkeys[meas] + 12) % 12;
//        c = color(colorwheel[(measkeys[meas] + 8) % 12]);
//        
//        fill(c);
//        rect(timesx[i], notesy[i], timesx[i+1]-timesx[i], 10)
//        fill(255, keypos*20);
//        rect(timesx[i], notesy[i], timesx[i+1]-timesx[i], 10)
//    }
        
        fill(0);
        
        textSize(60);
        fill(0);
        text("Bach Cello Suite No. 1: Prelude", 50, 100);
    
        fill('#EEE')
        rect(50, 200, 1168, 25)

        
        fill(0)
        textSize(40);
        text("A Visual Decomposition with Musical Keys mapped onto the Color Wheel", 50, 160);
    
        textAlign(RIGHT);
        text("Click anywhere to toggle play and pause", 1220, 6*height/8);
        textAlign(LEFT);
 
    

}

function draw() {

  if (frameCount % 12 == 0 || frameCount == 1) {
    console.log(frameCount);
    var midiValue = scaleArray[note];
    var freqValue = midiToFreq(midiValue);
    var i = Math.floor(frameCount/12);
    wave.freq(freqValue);

    envelope.play(wave, 0, 0.1);
    note = (note + 1) % scaleArray.length;
      
    var measpos = i%16;
    var meas = Math.floor(i/16);
    var dispmeas = meas + 1;
    var keypos = ((notes[i] % 12) - measkeys[meas] + 12) % 12;
    c = color(colorwheel[(measkeys[meas] + 8) % 12]);
      
    if (measpos == 0 || frameCount == 1) {
        fill(c);
        rect(timesx[i], 3*height/8 - 40, 1, height/2)
        if(meas < 41){
            textSize(15);
            text("Measure " + dispmeas, timesx[i] + 15, 3*height/8 - 20);
        }
    }
      
//    fill(c);
//    rect(timesx[0], 7*height/8, timesx[timesx.length-1]-timesx[0], height/32);
//    fill(255, keypos*20);
//    rect(0, 7*height/8, width, height/64);
      
    fill(c);  
    rect(timesx[i], 3*height/8, timesx[i+1]-timesx[i], height/2)
    rect(largex[i], 200, largex[i+1]-largex[i], 25)
    fill(255)
    rect(largex[i], largey[i], largex[i+1]-largex[i], 2)
    fill(255, keypos*20);
    rect(timesx[i], 3*height/8, timesx[i+1]-timesx[i], height/2)
      
    
    if (i >= notes.length) {
        noLoop();
    }
    
  }
    

}

function mousePressed() {
  if (playmode == true && mouseY < height - 40) {
      noLoop();
      playmode = false; 
  }
  else {
      loop();
      playmode = true;
  }
}

