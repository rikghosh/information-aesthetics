var times = [];
var notes = [];
var table;

var timesx = [];
var notesy = [];

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
    textFont(garamond);
    createCanvas(windowWidth*5, windowHeight);
    for (var i = 0; i < table.getColumn(0).length; i += 2) {
        times.push(table.getColumn(0)[i]);
        notes.push(table.getColumn(1)[i]);
    }
    console.log(times);
    console.log(notes);
    
    // map x and y positions of notes on screen
    for (var i = 0; i < times.length; i ++) {
        timesx.push(map(i, 0, times.length, 20, width - 20));
        notesy.push(map(notes[i], min(notes), max(notes), height - 100, 100));
    }
    
    console.log(min(notes));
    
    noStroke();
    
    for (var i = 0; i < timesx.length; i ++) {
        var measpos = i%16;
        var meas = Math.floor(i/16);
        var keypos = ((notes[i] % 12) - measkeys[meas] + 12) % 12;
        c = color(colorwheel[(measkeys[meas] + 8) % 12]);
        
        
        if (measpos == 0) {
            fill(c);
//            rect(timesx[i], 0, 1, height);
            rect(timesx[i], 3*height/8 - 40, 1, height/2)
            textSize(15);
            text("Measure " + meas, timesx[i] + 15, 3*height/8 - 20);
        }

//        fill(0);
//        ellipse(timesx[i], notesy[i], 10);

        
        fill(c);
        rect(timesx[i], 3*height/8, timesx[i+1]-timesx[i], height/2)
        opacity = opacities[keypos]
        fill(255, keypos*15);
        rect(timesx[i], 0, timesx[i+1]-timesx[i], height)
        
        fill(0);
//        text(noteconv[notes[i]%12], timesx[i] - 5, notesy[i] - 10);
//        text(noteconv[notes[i]%12], timesx[i], 3*height/8 - 10);
        
        textSize(60);
        fill(0);
        text("Bach Cello Suite No. 1: Prelude", 50, 100);
        

        textSize(40);
        text("A Visual Decomposition with Musical Keys mapped onto the Color Wheel", 50, 160);

        
    }
    

}

function draw() {
    
}