// position for the plot
var plotX1, plotY1; // top left corner
var plotX2, plotY2; // bottom right corner


var magnitudes;
var depths;
var magnitudeMax;
var depthMax;
var magnitudeMin;
var depthMin;

var latitudes, longitudes;

var magnitudeInterval = 1.0;
var depthInterval = 25.0;

// table as the data set
var table;

// variables for date and time
var year;
var month;
var day;
var clockTime;

var chosenQuake

var slider;
var earthquake = 0;


// the dots we'll be adding to the map
var circles = [];

// table as the data set
var table;

// my leaflet.js map
var mymap;


function preload() {
    table = loadTable("assets/significant_month.csv", "csv", "header");
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("canvas-holder");
    background(236,227,211);
    
    // create title
    textSize(30);
    textFont('Courier');
//    text("⚐ RECENT EARTHQUAKES EXPLORER", 120, 50);
    
    // plot boundaries
    plotX1 = 100;
    plotX2 = width*0.5;
    plotY1 = 150;
    plotY2 = height*0.56 + plotY1;
    
    // create slider explanatory text
    textSize(12);
//    text("Use this slider to navigate through different earthquakes:", 120, plotY2 + 60)
    
    // create slider
//    slider = createSlider(0, table.getRowCount()-1, 0, 1);
//    slider.position(110, plotY2 + 70);
//    slider.style('width', String(windowWidth - 130));
    
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
    for (var i=-500; i<=2000; i+=depthInterval){
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
    
    /*
    LEAFLET CODE

    In this case "L" is leaflet. So whenever you want to interact with the leaflet library
    you have to refer to L first.
    so for example L.map('mapid') or L.circle([lat, long])
    */

    // create your own map
    mymap = L.map('quake-map', {scrollWheelZoom: false}).setView([51.505, -0.09], 3);

    // load a set of map tiles (you shouldn't need to touch this)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiZHZpYTIwMTciLCJhIjoiY2o5NmsxNXIxMDU3eTMxbnN4bW03M3RsZyJ9.VN5cq0zpf-oep1n1OjRSEA'
    }).addTo(mymap);


    // call our function (defined below) that populates the maps with markers based on the table contents
    drawMapPoints();
}

function drawMapPoints(){
    strokeWeight(5);
    stroke(255,0,0);

    // get the two arrays of interest: depth and magnitude
    depths = table.getColumn("depth");
    magnitudes = table.getColumn("mag");
    latitudes = table.getColumn("latitude");
    longitudes = table.getColumn("longitude");

    // get minimum and maximum values for both
    magnitudeMin = 0.0;
    magnitudeMax = getColumnMax("mag");
    console.log('magnitude range:', [magnitudeMin, magnitudeMax])

    depthMin = 0.0;
    depthMax = getColumnMax("depth");
    console.log('depth range:', [depthMin, depthMax])

    // cycle through the parallel arrays and add a dot for each event
    for(var i=0; i<depths.length; i++){
        // create a new dot
        var circle = L.circle([latitudes[i], longitudes[i]], {
            color: 'red',      // the dot stroke color
            fillColor: '#f03', // the dot fill color
            fillOpacity: 0.25,  // use some transparency so we can see overlaps
            radius: magnitudes[i] * 40000
        });
        
        circle.bindPopup(i + "<br> Lat: " + latitudes[i] + " Long: " + longitudes[i]);

        // place it on the map
        circle.addTo(mymap).on('click', onClick);

        // save a reference to the circle for later
        circles.push(circle)
    }
}

function onClick(e) {
    console.log(this._popup._content[0]);
    coverOld();
    earthquake = this._popup._content[0];;
}

function removeAllCircles(){
    // remove each circle from the map and empty our array of references
    circles.forEach(function(circle, i){
        mymap.removeLayer(circle);
    })
    circles = [];
}

// get the maximum value within a column
function getColumnMax(columnName){
    // get the array of strings in the specified column
    var colStrings = table.getColumn(columnName);

    // convert to a list of numbers by running each element through the `float` function
    var colValues = _.map(colStrings, float);

    // find the max value by manually stepping through the list and replacing `m` each time we
    // encounter a value larger than the biggest we've seen so far
    var m = 0.0;
    for(var i=0; i<colValues.length; i++){
        if (colValues[i] > m){
            m = colValues[i];
        }
    }
    return m;

    // or do it the 'easy way' by using lodash:
    // return _.max(colValues);
}

function draw() {
    // variable for current value of slider to subset data
//    earthquake = slider.value();

    
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
//    slider.changed(coverOld);
    
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
