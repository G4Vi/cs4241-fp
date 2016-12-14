var http = require('http');
var htmlparser = require('htmlparser2');

var events = require('events');

var pageProcessor = function() {
    var self = this;

    var pageEvents = new events.EventEmitter();

    /*self.process = function (response, callback){
        console.log("in process")
    };*/

    self.process = parseResponse;

    self.processText = parseData;

    //parseResponse(
    //callback('sampletext');
    //return 'sampletext';

    /*
    return 'string is ' + strurl;
    }*/
}

module.exports = pageProcessor;

Error.stackTraceLimit = Infinity;
process.on('uncaughtException', function(er) {
    console.error(er.stack)
    process.exit(1)
})

function parseResponse(response, callback, context) {
    var data = "";
    response.on('data', function(chunk) {
        data += chunk;
    });

    response.on('end', function() {
        context.data = data
        parseData(callback, context)
    });



};

function parseData(callback, context) {
    var tags = [];
    var tagsCount = {};
    var tagsWithCount = [];
    console.log('parsing')
    var parsedData = new htmlparser.Parser({
        onopentag: function(name, attribs) {
            if (tags.indexOf(name) === -1) {
                tags.push(name);
                tagsCount[name] = 1;
            } else {
                tagsCount[name]++;
            }
        },
        onend: function() {
            for (var i = 1; i < tags.length; i++) {
                tagsWithCount.push({
                    name: tags[i],
                    count: tagsCount[tags[i]]
                });
            }
        }
    }, {
        decodeEntities: true
    });
    parsedData.write(context.data);
    parsedData.end();

    callback(tagsWithCount, context);
};
