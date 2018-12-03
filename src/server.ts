import express = require('express')
import { MetricsHandler } from './metrics'
import bodyparser = require('body-parser')

import session = require('express-session')
import levelSession = require('level-session-store')
const LevelStore = levelSession(session)


import { UserHandler, User } from './user'
const dbUser: UserHandler = new UserHandler('./db/users')

const userRouter = express.Router()


const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())


const port: string = process.env.PORT || '8080'

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//TP1-2

app.get('/', (req: any, res: any) => {
  res.setHeader('Content-Type', 'text/plain')
  //res.render('hello', { name: req.session.username })
  //res.write('Hello world')
  res.send('/hello takes a name query parameter like this: /hello/yourname, a random names replies hello [name], /hello/Clement (my own name) replies with a short intro of myself')
  res.end()
})
app.get('/hello/:name', (req: any, res: any) => {
  res.setHeader('Content-Type', 'text/plain')
  if (req.params.name === 'Clement') res.send('Hi! My name is Clement, I\'m a 5th year student at ECE Paris studying BigData & Analytics')
  else res.send('Hello ' + req.params.name)
})

app.use((req: any, res: any) => {
  res.setHeader('Content-Type', 'text/plain')
  res.status(404).send('Error 404. Message not found.')
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion de la sesssion

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'), //refers to const LevelStore=levelsession(session)
  resave: true,
  saveUninitialized: true
}))

// User handling

app.get('/login', (req: any, res: any) => {
  res.render('login')
})

app.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.username)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

// User router

userRouter.post('/', (req: any, res: any, next: any) => {
  const { username, password, email } = req.body
  const u = new User(username, password, email)
  dbUser.save(u, (err: Error | null) => {
    if (err) next(err)
    res.satus(200).send("user saved")
  })
})

userRouter.get('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.username)) {
      res.status(404).send("user not found")
    } else {
      res.status(200).json(result)
    }
  })
})


app.use('/user', userRouter)


// USER AUTHORIZATION MIDDLEWARE

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    next()
  } else res.redirect('/login')
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metrics

app.get('/metrics', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.get('/metrics:id', (req: any, res: any) => {
  MetricsHandler.get((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    if (result === undefined) {
      res.write('no result')
      res.send()
    }
    else res.json(result)
  })
})


app.post('/metrics/:id', (req: any, res: any, next: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null, result?: any) => {
    if (err) {
      res.status(500).send(err.message)
    }
    res.status(200).send()
  });
})

app.delete('/:id', (req: any, res: any, next: any) => {
  dbMet.remove(req.params.id, (err: Error | null) => {
    if (err) next(err)
    res.status(200).send()
  })
})


app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})



   /*  "populate":"./node_modules/.bin/ts-node bin/populate.ts" ds packageconfig.json */
   //Metric -> Delete route/metrics/:id
   //Mocha + should