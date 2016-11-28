
var http = require('http');
var htmlparser = require('htmlparser2');

var url = 'http://www.codingdefined.com'

http.get(url, function(response) {
  parseResponse(response);
})

var parseResponse = function(response) {
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
   console.log(tagsWithCount);
  });
} 
