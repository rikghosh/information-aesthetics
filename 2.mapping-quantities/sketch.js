// position for the plot
var plotX1, plotY1; // top left corner
var plotX2, plotY2; // bottom right corner


var magnitudes;
var depths;
var magnitudeMax;
var depthMax;

var magnitudeInterval = 1.0;
var depthInterval = 25.0;

// table as the data set
var table;

// variables for date and time
var year;
var month;
var day;
var clockTime;

var slider;
var earthquake;


function preload() {
    table = loadTable("assets/significant_month.csv", "csv", "header");
}

function setup() {
    createCanvas(windowWidth, windowHeight*2);
    background(236,227,211);
    
    // create title
    textSize(30);
    textFont('Courier');
    text("⚐ RECENT EARTHQUAKES EXPLORER", 120, 50);
    
    // plot boundaries
    plotX1 = 100;
    plotX2 = width*0.5;
    plotY1 = 150;
    plotY2 = height*0.56/2 + plotY1;
    
    // create slider explanatory text
    textSize(12);
    text("Use this slider to navigate through different earthquakes:", 120, plotY2 + 60)
    
    // create slider
    slider = createSlider(0, table.getRowCount()-1, 0, 1);
    slider.position(110, plotY2 + 70);
    slider.style('width', String(windowWidth - 130));
    
    // draw axes
    stroke(128);
    strokeWeight(3);
    // vertical
    line(plotX1, 0, plotX1, height);
    // horizontal
    line(0, plotY2, windowWidth, plotY2);
    
    generateMinMax();
    
    // axis label color
    fill(0);
    
    // draw horizontal grid lines
    strokeWeight(1);
    for (var i=-100; i<=25; i+=magnitudeInterval){
        noStroke();
        textSize(8);
        textAlign(RIGHT, CENTER);
        
        // map y to the plotting surface
        var y = map(i, 0, magnitudeMax, plotY2, plotY1);

        // create axis values
        if (i > 0 && i <= magnitudeMax){
           text(floor(i), plotX1 - 10, y - 10); 
        }
        
        // add visual tick mark
        stroke(128, 60);
        strokeWeight(1);
        line(0, y, windowWidth, y);
    
    }
    
    
    // draw vertical grid lines
    for (var i=-500; i<=1000; i+=depthInterval){
        noStroke();
        textSize(8);
        textAlign(CENTER, CENTER);
        
        // map y to the plotting surface
        var x = map(i, 0, depthMax, plotX1, plotX2);

        // draw a line for each interval
        strokeWeight(1);
        stroke(128, 60);
        line(x, 0, x, height);

        // write value
        if (i > 0 && i <= depthMax){
            text(floor(i), x + 10, plotY2 + 15);
        }
        
        textSize(15);
        strokeWeight(0);
;
        
    } 
    
    // background for information box
    fill(236, 227, 211);
    rect(plotX2 + 90, 50, 470, plotY2 - 100)
    
    // explanatory text
    fill(0);
    textSize(20);
    textAlign(LEFT);
    text("This earthquake happened:", plotX2 + 100, 70);
    text("on:", plotX2 + 100, 130);
    text("It was at a depth of:", plotX2 + 100, 240);
    text("and had a magnitude of:", plotX2 + 100, 300);
    text("Technical Information:", plotX2 + 100, 420);
}

function draw() {
    // variable for current value of slider to subset data
    earthquake = slider.value();
    
    strokeWeight(7);
    stroke(255,0,0);

    // get information to display
    var location = table.getColumn('place')[earthquake];
    var time = table.getColumn('time')[earthquake];
    var depth = depths[earthquake];
    var magnitude = magnitudes[earthquake];
    var lat = table.getColumn('latitude')[earthquake];
    var long = table.getColumn('longitude')[earthquake]
    
    formatTime(time);
    
    // cover old text when slider is changed with blank box
    slider.changed(coverOld);
    
    // information text
    noStroke();
    fill(0)
    text(location, plotX2 + 100, 100);
    text(month + " " + day + ", " + year + " at " + clockTime + ".", plotX2 + 100, 160);
    text(depth + " km", plotX2 + 100, 270);
    text(magnitude + ".", plotX2 + 100, 330);
    text("Lat: " + lat + "\t Long: " + long, plotX2 + 100, 450)
    
    fill(255);
    
    drawDataPoints();
    
    // reset text size
    textSize(20);

}

// draw blank boxes of background color to cover old text on slider change
function coverOld() {
    noStroke();
    fill(236, 227, 211);
    for (var i = 0; i < 7; i++){
    rect(plotX2 + 91, 80 + i*60, 468, 30);
    }
}

function drawDataPoints(){
    // start with red points
    strokeWeight(0);
    fill(255, 0, 0);
    
    generateMinMax();

    for(var i = 0; i < depths.length; i++){
        // 
        var x = map(depths[i], 0, depthMax, plotX1, plotX2);
        var y = map(magnitudes[i], 0, magnitudeMax, plotY2, plotY1);
        // black point if selected by slider
        if (i == earthquake) {
            fill(0);
        }
        // red point for subsequent points
        if (i > earthquake) {
            fill(230, 39, 39);
        }
        textSize(25);
        text("⚠︎",x,y);
    }
}


function generateMinMax() {
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    
    magnitudeMax = ceil(max(magnitudes)/magnitudeInterval)*magnitudeInterval;
    depthMax = ceil(max(depths)/depthInterval)*depthInterval;
}

// convert time data to useable values
function formatTime(input) {
    year = input.substr(0, 4);
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    month = months[int(input.substr(5, 2))-1];
    day = input.substr(8,2);
    clockTime = input.substr(11, 5);
}
