
var http = require('http');
var htmlparser = require('htmlparser2');

var events =  require('events');

var pageProcessor = function (){
    var self = this;

    var pageEvents = new events.EventEmitter();

    /*self.process = function (response, callback){
        console.log("in process")
    };*/

    self.process = parseResponse;

    //parseResponse(
        //callback('sampletext');
        //return 'sampletext';

    /*
    return 'string is ' + strurl;
    }*/
}

module.exports = pageProcessor;

Error.stackTraceLimit = Infinity;
process.on('uncaughtException', function (er) {
  console.error(er.stack)
  process.exit(1)
})

function parseResponse (response, callback) {
  var data = "";
  response.on('data', function(chunk) {
    data += chunk;
  });
  var tags = [];
  var tagsCount = {};
  var tagsWithCount = [];
  response.on('end', function(chunk) {
    var parsedData = new htmlparser.Parser({
     onopentag: function(name, attribs) {
      if(tags.indexOf(name) === -1) {
       tags.push(name);
 tagsCount[name] = 1;
       } else {
 tagsCount[name]++;
       }
     },
     onend: function() {
      for(var i = 1;i < tags.length;i++) {
       tagsWithCount.push({name:tags[i], count:tagsCount[tags[i]]});
     }
    }
   }, {decodeEntities: true});
   parsedData.write(data);
   parsedData.end();
   //console.log(tagsWithCount);
   callback(tagsWithCount, data);
  });
}

