var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , port = 8080


//load movies array from another js file
var movies = require('./movies')

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url, true)

  switch( uri.pathname ) {    
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


function handleSearch(res, uri) {
  var contentType = 'text/html'
  res.writeHead(200, {'Content-type': contentType})

  var html = ''
  //if printing the whole page (not ajax) print the items above the movie list
  if(uri.query && (!uri.query.inline))
  {
      html = printHTMLStart()
      console.log("notinline")    
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
        html = html + '<h2>Movies with "' + uri.query.search + '" in the name</h2>' + arrayToHTMLList(filteredMovies)       
    }
    
     
    
    
  } else {
      //on error or blank query print all movies
      html = html + '<h2>All Movies</h2>' + arrayToHTMLList(movies)      
  }
  
  //add javascript and closing tags if it is not an inline request
  if(!uri.query.inline)
  {
      html = html + printHTMLEnd()        
  }
  
  //finally send it
  res.end(html)
}

//avoid regex crashing the app if a backslash is submitted
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
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
  html = html + '<div class="left"></div>'
  html = html + '<div class="right"></div>'
  
  html = html + '<div class = "content">'
  html = html + '<h1>Movie Search</h1>'

  html = html + '<form action="search" method="get">'
  html = html + '<input type="text" name="search" id="searchbox" autocomplete="off"/>'
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
  html = html + arrayToHTMLList(movies) 
  
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

function arrayToHTMLList(movieNames)
{  
    var html = '<ul>'
    html = html + movieNames.map(createListItem).join(' ')    
    html = html + '</ul>'
    
    return html
}

function createListItem(d)
{
    html = '<li>'
    html = html + '<form action="delete" method="post">'
    html = html + '<input type="text" name="delete" id="deletebox" value="'
    html = html + d
    html = html + '" readonly autocomplete="off"/>'
    html = html + '<button type="submit">Edit</button>'
    html = html + '</form>' 
    html = html + '</li>'
    return html
}
