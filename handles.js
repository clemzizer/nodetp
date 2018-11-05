const http = require('http')
const url = require('url')
const qs = require('querystring')


module.exports = {
    serverHandle: function (req, res) {
 

  const route = url.parse(req.url)
  const path = route.pathname 
  const params = qs.parse(route.query)

   console.log(params);
   console.log(path);


  res.writeHead(200, {'Content-Type': 'text/html'});

   if (path === '/hello' && 'name' in params) {
    if(params['name']==='Clement'){
      res.write('Hi! My name is Clement, I\'m a 5th year student at ECE Paris studying BigData & Analytics');
    }
    else{
      res.write('Hello ' + params['name'])
    }
  } else if(path === '/explains'){
    res.write('/hello takes a name query parameter like this: /hello?name=yourname, random names replies hello [name], /hello?name=Clement (my own name) replies with a short intro of myself')
  }
  else {
    res.write('Erreur 404')
  }


  res.end();
}
}
