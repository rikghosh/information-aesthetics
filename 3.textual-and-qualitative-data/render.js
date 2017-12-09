#!/usr/bin/env node
var fs = require('fs'),
    _ = require('lodash'),
    handlebars = require('handlebars'),
    converter = require('number-to-words');

var tmplSource = fs.readFileSync('template.html', 'utf-8'),
    template = handlebars.compile(tmplSource),
    data = JSON.parse(fs.readFileSync('assets/shows.json', 'utf-8'));

var byArtist = _.groupBy(data, 'artist');
var byVenue = _.groupBy(data, 'venue');
var names = _.uniq(_.map(data, 'artist')).sort();

var byDay = _.groupBy(data, 'time.day');

var dayZero = _.groupBy(byDay['0'], 'time.startHour');
var dayOne = _.groupBy(byDay['1'], 'time.startHour');
var dayTwo = _.groupBy(byDay['2'], 'time.startHour');
var dayThree = _.groupBy(byDay['3'], 'time.startHour');


// sort events of each day by start time
[dayZero, dayOne, dayTwo, dayThree].forEach(function(day){
    for (i in day) {
    day[i] = _.orderBy(day[i], ['time.startHour', 'time.startMinute']);
    }
})

console.log(dayThree);
//for (i in dayOne) {
//    dayOne[i] = _.orderBy(dayOne[i], ['time.startHour', 'time.startMinute']);
//}


//for (hour in dayThree) {
//    console.log('---'+hour+'---')
//    dayThree[hour].forEach(function(element) {
//        console.log([element['artist'], element['schedule'].start]);
//    })
//};
//
//console.log(dayThree);


//for (var i in byArtist) {
//    console.log([i, byArtist[i][0]]);
//}

//var trial = _.map(byArtist, '')
//console.log(byArtist['Ziemba'][0].venue);
//console.log(byArtist);

var shows = []
names.forEach(function(name){
  shows.push(byArtist[name])
})

var markup = template({names:names, shows:shows, thursday:dayZero, friday: dayOne, saturday: dayTwo, sunday: dayThree})
fs.writeFileSync('site/index.html', markup)
