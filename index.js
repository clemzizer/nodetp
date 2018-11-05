// Import a module
const http = require('http')
const url = require('url')
const qs = require('querystring')

const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'         <p>Hello World !</p>' +
'    </body>' +
'</html>'

const serverHandle = function (req, res) {
  // Retrieve and print the current path


 

  const route = url.parse(req.url)
  const path = route.pathname 
  const params = qs.parse(route.query)

   console.log(params);
   console.log(path);


  res.writeHead(200, {'Content-Type': 'text/html'});

   if (path === '/hello' && 'name' in params) {
    res.write('Hello ' + params['name'])
  } else {
    res.write('Hello anonymous')
  }
  //http://localhost:8080/hello?name=Clem
  //res.write(content);
  res.end();
}

const server = http.createServer(serverHandle);
server.listen(8080)


// curl localhost:8080 or go to http://localhost:8080