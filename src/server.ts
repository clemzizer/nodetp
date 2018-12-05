//Gen
import express = require('express')
import { MetricsHandler, Metric } from './metrics'
import bodyparser = require('body-parser')
import path = require('path')

//Error handling middleware
import morgan = require('morgan')

//Gestion de la sesssion
import session = require('express-session')
import levelSession = require('level-session-store')
const LevelStore = levelSession(session)

//User Authentication
import { UserHandler, User } from './user'
const dbUser: UserHandler = new UserHandler('./db/users')

const userRouter = express.Router()


const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))
app.use(morgan('dev'))


app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');

const port: string = process.env.PORT || '8080'

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion de la sesssion

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'), //refers to const LevelStore=levelsession(session)
  resave: true,
  saveUninitialized: true
}))


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User Authentication

app.get('/login', (req: any, res: any) => {
  res.render('login')
})
app.get('/signup', (req: any, res: any) => {
  res.render('signup')
})
app.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.send("not logged in")
      //res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      //res.redirect('/')
      res.send("logged in")
    }
  })
})
app.post('/signup', (req:any, res:any, next:any)=>{
  //How can you use your own API ??
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      if(result!==undefined) res.status(409).send("user already exists")
      else res.send(err)
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("User saved !!!")
      })
    }
  })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User Authorization Middleware

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User creation and retreival

userRouter.post('/', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      if(result!==undefined) res.status(409).send("user already exists")
      else res.send(err)
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.status(201).send("User saved !!!")
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    // if (result === undefined || !result.validatePassword(req.body.username)) {
    if (result === undefined) {
      res.status(404).send("User not found")
    } else {
      res.status(200).json(result)
    }
  })
})
app.delete('/user/:id', (req: any, res: any, next: any) => {
  dbUser.delete(req.params.id, (err: Error | null) => {
    if (err) next(err)
    else res.status(200).send("If the userid exists it has been deleted !!!")
  })
})



app.use('/user', userRouter)


////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metrics

app.get('/metrics/:id', (req: any, res: any, next: any) => {
  dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
    if (err) {
      next(err)
    }
    if (result === undefined) {
      res.write('no result')
      res.send()
    }
    else {
      res.json(result)
    }
  })
})

app.post('/metrics/:id', (req: any, res: any, next: any) => {
  //console.log(req)
  //console.log(req.params)
  console.log(req.body)
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) {
      next(err)
    }
    else res.status(200).send("Metrics saved !!!")

  });
})

app.delete('/metrics/:id', (req: any, res: any, next: any) => {
  dbMet.remove(req.params.id, (err: Error | null) => {
    if (err) next(err)
    else res.status(200).send("If the metrics Id exists it has been deleted !!!")
  })
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


/// Keep it in the end ///
app.use((req: any, res: any) => {
  res.setHeader('Content-Type', 'text/plain')
  res.status(404).send('Error 404. Message not found.')
})
//////////////////////////

app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})



   /*  "populate":"./node_modules/.bin/ts-node bin/populate.ts" ds packageconfig.json */
   //Metric -> Delete route/metrics/:id
   //Mocha + should
