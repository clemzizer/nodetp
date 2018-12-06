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


const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(morgan('dev'))


app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');

const port: string = process.env.PORT || '8080'

let dbMet: MetricsHandler | undefined


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Gestion de la sesssion

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'), //refers to const LevelStore=levelsession(session)
  resave: true,
  saveUninitialized: true
}))

app.get('/populate',(req: any, res: any) => {
  res.render('populate_db', { message: null })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User Authentication

const authRouter = express.Router()


authRouter.get('/login', (req: any, res: any) => {
  res.render('login', { message: null })
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup', { message: null })
})
authRouter.get('/logout', (req: any, res: any) => {
  if (req.session.loggedIn) {
    delete req.session.loggedIn
    delete req.session.user
    if(dbMet!=undefined)dbMet.db.close()
    dbMet = undefined
  }
  res.redirect('/')
})

authRouter.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.render('login', { message: "Wrong username or password !!!!" })
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})
authRouter.post('/signup', (req: any, res: any, next: any) => {
  //How can you use your own API ??
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      if (result !== undefined) res.render('signup', { message: "User already exists try again!" })
      else res.send(err)
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.render('login', { message: "User saved !!! Now login:" })
      })
    }
  })
})


app.use(authRouter)

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User Authorization Middleware

const authCheck = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) {
    if (dbMet == undefined) dbMet = new MetricsHandler(`./db/${req.session.user.username}`)
    next()
  } else res.render('login', { message: "You need to login" })
}

app.get('/', authCheck, (req: any, res: any) => {
  res.render('metrics', { name: req.session.user.username })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User creation and retreival

const userRouter = express.Router()

userRouter.post('/', function (req: any, res: any, next: any) {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
      if (result !== undefined) res.render('signup', { message: "User already exists !!!" })
      else res.send(err)
    } else {
      dbUser.save(req.body, function (err: Error | null) {
        if (err) next(err)
        else res.render('login', { message: "User created !!!" })
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
userRouter.delete('/:username', (req: any, res: any, next: any) => {
  dbUser.delete(req.params.username, (err: Error | null) => {
    if (err) next(err)
    else res.status(200).send("If the username exists it has been deleted !!!")
  })
})



app.use('/user', userRouter)


////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metrics
const metricsRouter = express.Router()

metricsRouter.get('/:id', (req: any, res: any, next: any) => {
  if (dbMet == undefined) dbMet = new MetricsHandler(`./db/${req.session.user.username}`)
  dbMet.get(req.params.id, (err: Error | null, result?: Metric[]) => {
    if (err) {
      next(err)
    }
    if (result === undefined) {
      res.send('No result')
    }
    else {
      res.json(result)
    }
  })
})

metricsRouter.post('/:id', (req: any, res: any, next: any) => {
  //console.log(req.params)
  //console.log(req.body)
  if (dbMet == undefined) dbMet = new MetricsHandler(`./db/${req.session.user.username}`)
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) {
      next(err)
    }
    else res.status(200).send("Metrics saved !!!")

  });
})

metricsRouter.delete('/:id', (req: any, res: any, next: any) => {
  if (dbMet == undefined) dbMet = new MetricsHandler(`./db/${req.session.user.username}`)
  dbMet.remove(req.params.id, (err: Error | null) => {
    if (err) next(err)
    else res.status(200).send("If the metrics ID exists it has been deleted !!!")
  })
})

app.use('/metrics', authCheck, metricsRouter)

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
