var express = require('express');
var router = express.Router();

//Faut il faire des vues ejs?

router.get(
  '/hello/:name',
  (req, res) => { if(req.params.name=='Clement'){
    res.send('Hi! My name is Clement, I\'m a 5th year student at ECE Paris studying BigData & Analytics')}

  else res.send("Hello " + req.params.name)
}
)
router.get(
  '/explains',
  (req, res) => res.send('/hello takes a name query parameter like this: /hello/yourname, a random names replies hello [name], /hello/Clement (my own name) replies with a short intro of myself')
)
router.get(
  '*',
  (req, res) => res.send('Erreur 404')
)



module.exports = router;
