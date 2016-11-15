var http = require('http')
, fs   = require('fs')
, url  = require('url')
, port = 8080
, qs   = require('querystring');


var movieTXT = 'top250.txt'
var movies = fs.readFileSync(movieTXT).toString().split("\n");

var server = http.createServer (function (req, res) {
var uri = url.parse(req.url, true)

switch( uri.pathname ) {
    case '/insert':
    handleInsert(req, res, uri)
    break
    case '/delete':     
    handleDelete(req, res, uri)
    break
    case '/search':
    handleSearch(res, uri)
    break    
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
    case '/popcorn.png':
    sendFile(res, 'popcorn.png', 'image/png')
    break   
    default:
    res.end('404 not found')
}

})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

function handleInsert(req, res, uri){
    
    //make sure its post
    if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;
            
            //1MB max request size            
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);       
            
            //check movies to see if its a valid post request and act
            console.log('inserting')           
            var movie = post['movie']
            insertMovie(movie, res)          
            
        });
    }
    else{
        console.log("not post")
        sendIndex(res)              
    }   

}



function handleDelete(req, res, uri){
    
    //make sure its post
    if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;
            
            //1MB max request size            
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
            var post = qs.parse(body);       
            
            //check movies to see if its a valid post request and act
            console.log('removing')           
            var movie = post['movie']
            removeMovieBlocking(movie)
            //removeMovie(movie, res)
                      
            //send it after removing if blocking.           
            sendIndex(res)
            
            
        });
    }
    else{
        console.log("not post")
        sendIndex(res)              
    }   

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

function printHTMLStart()
{
var html = ''
html = html + '<html>'

html = html + '<head>'

html = html + ' <title>CS4241 Assignment 4 - Gavin Hayes</title> <meta charset="utf-8"> <link rel="stylesheet" type="text/css" href="style.css"/>'
html = html + '<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">'

html = html + '</head>'

html = html + '<body>'
html = html + '<div class="backimg" id="popback">'
html = html + '</div>'
html = html + '<div class = "content">'
html = html + '<h1>Movie Search</h1>'

html = html + '<form action="search" method="get">'
html = html + '<input type="text" name="search" id="searchbox" value="Enter a movie to search" autocomplete="off"/>'
html = html + '<button type="submit">Search</button>'
html = html + '</form>'

html = html + '<div id=movielist>'
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

// Note: consider this your "index.html" for this assignment
function sendIndex(res) {
var contentType = 'text/html'

var html = printHTMLStart()

html = html + '<h2>All Movies</h2>'
console.log('sending movies')
html = html + arrayToTable(movies) 

html = html + printHTMLEnd()


res.writeHead(200, {'Content-type': contentType})
res.end(html, 'utf-8')
}

function sendFile(res, filename, contentType) {
contentType = contentType || 'text/html'

fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
})

}

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