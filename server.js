var http = require('http')
, fs   = require('fs')
, url  = require('url')
, port = 8080
, qs   = require('querystring');

var config = require('./config')
var mysql  = require('mysql');
var validUrl = require('valid-url');

//var movies = fs.readFileSync(movieTXT).toString().split("\n");

var pageProcessor = require('./pageProcessor.js');
var pageProcessorInstance = new pageProcessor();


function handleGrade(body, res){
    var post = qs.parse(body);
    var url = post['url']
    var text = post['text']


    //open db connection
    var connection = mysql.createConnection(config.database)
    connection.connect();


    //Determine submitted type
    if(url)
    {
        handleUrl(url, res,connection)
    }
    else if(text)
    {
        handleText(text, res, connection)
        console.log(text)
    }
};

//INCOMING REQUESTS
var server = http.createServer (function (req, res) {
var uri = url.parse(req.url, true)

    //POST Requests
    if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;

            //1MB max request size
            if (body.length > 1e6)
                req.connection.destroy();
        });


        switch( uri.pathname ) {
             case '/grade':
             var func = function(){ handleGrade(body, res)}
              req.on('end',func)
             break
             default:
             res.end('404 not found')
         }


    }
    else{
        //Get Requests
        switch( uri.pathname ) {
    case '/':
    sendIndex(res)
    break
    case '/index.html': //incase a webbrowser requests the site by this
    sendIndex(res)
    break
    case '/style.css':
    sendFile(res, 'style.css', 'text/css')
    break
    case '/js/scripts.js':
    sendFile(res, 'js/scripts.js', 'text/javascript')
    break
    case '/README.md':
    sendFile(res, 'README.md', 'text/plain')
    break

    default:
    res.end('404 not found')
}
    }



})

server.listen(process.env.PORT || port)
console.log('listening on 8080')


function handleText(text, res, context)
{
    var url = '666'
    pageProcessorInstance.process(text,  updateDB, context)
};

function handleUrl(url, res, connection){
//Determine if url is in database
console.log('url is ' +  url)
var escapedurl = mysql.escape(url)
console.log('escapedurl is ' + escapedurl)
var query = 'SELECT * FROM `pages` WHERE `location` = "' + escapedurl + '"'
console.log('handleUrl: ' + query)

var context = new Object();
context.escapedurl = escapedurl;
context.connection = connection;
context.res = res;
context.url = url;

console.log('logging context.escapedurl' + context.escapedurl)

connection.query(query, function(err, rows, fields) {
  if (err) throw err;

  if(rows.length >= 1){
      makehtml(JSON.parse(rows[0].json_tags), rows[0].html, context)
  }
  else{
      performWebLookup(context);
  }
});


//Download the page and parse it
function performWebLookup(context){

if (validUrl.isUri(url)){
    http.get(url, function(response) {

    pageProcessorInstance.process(response, updateDB, context)
    })
    console.log('made request')
    } else {
        console.log('Not a URI');
        makehtml('', '', context)
    }
}

}//handleUrl


//Inserts new rows and updates existing with new information
function updateDB(obj, data, context)
{
    var safe_obj_str = JSON.stringify(obj)
    var page = {location: context.escapedurl, html: data, json_tags: safe_obj_str};
    var pageUpdate = {html: data, json_tags: safe_obj_str};

    var addAndUpdateQuery = 'INSERT INTO pages SET ? ON DUPLICATE KEY UPDATE ?'

    console.log('updateDB: ' + addAndUpdateQuery)
    context.connection.query(addAndUpdateQuery, [page, pageUpdate], function(err, rows, fields) {
        if (err) throw err;
    });

    //output the html
    makehtml(obj,data, context)
}


function makehtml(obj, data, context){
//close db connection
context.connection.end();

var html = printHTMLStart()
html += '<h2>' + context.url + '</h2>'

//Build table
html += '<table><tr><th>Tag</th><th>Count</th></tr>'
for(var counter in obj )
{
    //console.log(obj[counter].name)
    html += '<tr><td>'+ obj[counter].name + ' </td>'
    html += '<td>' + obj[counter].count + '<td></tr>'
}
html += '</table>'

//Display source code
html += '<div id="srccode"><textarea>'
html += data
html += '</textarea></div>'


html += printHTMLEnd()
var contentType = 'text/html'
context.res.writeHead(200, {'Content-type': contentType})
context.res.end(html, 'utf-8')
}//makehtml


function printHTMLStart()
{
var html = ''
html = html + '<html>'

html = html + '<head>'

html = html + ' <title>CS4241 Final Project - Gavin Hayes and Nick Chaput</title> <meta charset="utf-8"> <link rel="stylesheet" type="text/css" href="style.css"/>'
html = html + '<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">'

html = html + '</head>'

html = html + '<body>'
html = html + '<div class="backimg" id="popback">'
html = html + '</div>'
html = html + '<div class = "content">'
html = html + '<h1>HTML Grader</h1>'

html += '<h2>Enter a URL</h2>'
html += '<form action="grade" method="post">'
html = html + '<input type="text" name="url" id="insertbox" autocomplete="off"/></td><td>'
html += '<h2>or paste your html here</h2>'
html += '<textarea name="text"></textarea>'
html += '<br>'
html = html + '<button type="submit">Process</button>'
html = html + '</form>'




html = html + '<div id="results">'
return html
}

function printHTMLEnd()
{
var html = '</div></div>'

html = html + '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>'
html = html + '<script src="js/scripts.js"></script>'

html = html + '</body>'
html = html + '</html>'

return html

}

function sendIndex(res) {
//html += '<iframe src="https://docs.google.com/document/d/1cxTkJFr-B7OU0awR64GOLbRcYTjrzG91dbKz3zz62ik/pub?embedded=true"></iframe>'

//open db connection
var connection = mysql.createConnection(config.database)
connection.connect();

var url = 'http://computoid.com'
handleUrl(url, res, connection)
}

function sendFile(res, filename, contentType) {
contentType = contentType || 'text/html'

fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
})

};

/*
function arrayToTable(movieNames)
{
    var html = '<table>'
    html = html + '<thead><tr><th>Movie</th><th></th></tr</thead>'
    html = html + '<tbody>'

    //Add movie form
    html = html + '<tr><form action="insert" method="post">'
    html = html + '<td>'
    html = html + '<input type="text" name="movie" id="insertbox" value="Enter a movie to insert" autocomplete="off"/></td><td>'
    html = html + '<button type="submit">Insert</button>'
    html = html + '</td></form>'
    html = html + '</tr>'

    //Existing movies
    html = html + movieNames.map(createListItem).join(' ')
    html = html + '</tbody></table>'

    return html
}

function createListItem(d)
{

    html = ''

    html = html + '<tr><form action="delete" method="post"><td>'
    html = html + d
    html = html + '</td><td><button name="movie" value="'
    html = html + d
    html = html + '">Delete</button>'
    html = html + '</td></form>'
    html = html + '</tr>'


    return html
}

//avoid regex crashing the app if a backslash is submitted
function escapeRegExp(str) {
return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function removeMovieBlocking(movieName)
{
  //read the movies into data
  var data = fs.readFileSync(movieTXT, 'utf8').toString()

  //determine if string exists in file
  var stringToSearch = escapeRegExp(movieName + '\n')
  var term = new RegExp( stringToSearch, 'g' )
  var exists = data.search(term) >= 0

  //actually replacing it
  if(exists){
      var result = data.replace(term, '');
      fs.writeFileSync(movieTXT, result, 'utf8')


      //reload movies array
      movies = fs.readFileSync(movieTXT, 'utf8').toString().split("\n");
      console.log('array updated!')

  }
}

function removeMovie(movieName, res)
{
  //read the movies into data
  fs.readFile(movieTXT, 'utf8', function (err,data) {
  if (err){
      sendIndex(res)
      return console.log(err);
  }

  //determine if string exists in file
  var stringToSearch = escapeRegExp(movieName + '\n')
  var term = new RegExp( stringToSearch, 'g' )
  var exists = data.search(term) >= 0

  //actually replacing it
  if(exists){
      var result = data.replace(term, '');
      fs.writeFileSync(movieTXT, result, 'utf8')

      //reload movies array
      fs.readFile(movieTXT, (err, data) => {
          if (err){
              console.log(err)
              sendIndex(res)
              return;
          }
          movies = data.toString().split("\n");
          console.log('array updated!')
          sendIndex(res)

      });
  }
  else
  {
      sendIndex(res)
  }

});

}


function insertMovie(movieName, res)
{
    fs.appendFile(movieTXT, movieName, encoding='utf8', function (err) {
        if (err)
        {
            sendIndex(res)
            return console.log(err);
        }
        else
        {
               fs.readFile(movieTXT, (err, data) => {
          if (err){
              console.log(err)
              sendIndex(res)
              return;
          }
          movies = data.toString().split("\n");
          console.log('array updated!')
          sendIndex(res)

      });
        }

});
}


 function handleSearch(res, uri) {
var contentType = 'text/html'
res.writeHead(200, {'Content-type': contentType})

var html = ''
//if printing the whole page (not ajax) print the items above the movie list
if(uri.query && (!uri.query.inline))
{
    html = printHTMLStart()
}

//if there is a search query
if(uri.query && (uri.query.search !== "")) {
    console.log(uri.query)

    var filteredMovies = [];

    //loop through all the movies and try to match substrings
    for(var i = 0; i < movies.length; i++)
    {
        var term = new RegExp( escapeRegExp(uri.query.search), 'i' )
        var result = movies[i].match(term)
        if(result)
        {
            filteredMovies.push(movies[i])
        }
    }

    //if no movies found
    if(filteredMovies.length == 0)
    {
        html = html + '<h2>No movies names with: "' + uri.query.search + '"</h2>'
    }
    else //movies found
    {
        html = html + '<h2>Movies with "' + uri.query.search + '" in the name</h2>' + arrayToTable(filteredMovies)
    }




} else {
    //on error or blank query print all movies
    html = html + '<h2>All Movies</h2>' + arrayToTable(movies)
}

//add javascript and closing tags if it is not an inline request
if(!uri.query.inline)
{
    html = html + printHTMLEnd()
}

//finally send it
res.end(html)
}
*/
