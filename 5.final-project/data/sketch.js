//
// load your CSV/JSON/TXT/etc data in the preload() function then demonstrate its use either
// through println() calls in setup() or with a preliminary version of your final visualization
// in setup() + draw()
//

var dataset;

function preload() {
    // dataset = loadTable("your_csv_data_file_or_URL.csv", "csv", "header");
    // dataset = loadJSON("your_json_file_or_URL.json")
    // dataset = loadStrings("your_text_file.txt")
}

function setup() {
    createCanvas(100, 100);
    background(200);
    noStroke();
    fill(127);
}

function draw(){
    background(127 + 127*Math.sin(millis()/1000));
    rect(45,45, 10,10);
}
