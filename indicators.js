const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
require("colors");

const inputFile = "indicators.csv";
const outputFile = "indicators.json"

var i = 1;

const instream = fs.createReadStream(inputFile);
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);

var writeDataToFile = function(data, type) {
    var writeAction = fs.writeFile;
    if (type) writeAction = fs.appendFile;
    writeAction(outputFile, data, function(error) {
        if(error) console.error('Write error: '+ error.message.red);
    });
};
//Writes the initial data
writeDataToFile('{\n\"data\":[\n');
startTime = new Date().getTime();
console.log(('Started Parsing at '+startTime+' ms.').green);



rl.on('line', function(data) {
    parser(data);
});

//Appends the final data
rl.on('close', function() {
    writeDataToFile('\n\t]\n}', 1);
    endTime = new Date().getTime();
    console.log(('Finished Parsing at '+endTime+' ms.').green);
    console.log(("Execution time = " + ((endTime - startTime)/1000)  +' sec' ).green);
});

var columns = [];

var parser = function(line) {
    if(i == 1) {
        columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        // console.log(columns);
    }
    else {
        var newLine = [];
        lineTemp = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        lineTemp.forEach(function(string) {
            newLine.push(string.replace(/['"]+/g, ''));
        });
        var fields = ["Life expectancy at birth, female (years)", "Life expectancy at birth, male (years)", "Birth rate, crude (per 1,000 people)", "Death rate, crude (per 1,000 people)"];
        if(fields.indexOf(newLine[2]) !== -1) {
            var newObj = {};
            newObj[columns[0]] = newLine[0];
            newObj[columns[1]] = newLine[1];
            newObj[columns[2]] = newLine[2];
            newObj[columns[3]] = newLine[3];
            newObj[columns[4]] = newLine[4];
            newObj[columns[5]] = newLine[5];
            var data = JSON.stringify(newObj);
            if (data != '{}') {
                writeDataToFile(data + ",\n", 1);
            }
        }
    }
    i++;
}


