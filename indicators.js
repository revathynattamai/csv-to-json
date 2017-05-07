const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

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

//Appends the final data
rl.on('close', function() {
    writeDataToFile('\n\t]\n}', 1);
});



