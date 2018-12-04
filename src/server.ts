//Gen
import express = require('express')
import { MetricsHandler, Metric} from './metrics'
import bodyparser = require('body-parser')

//Middlewares
import morgan = require('morgan')

//Session
import session = require('express-session')
import levelSession = require('level-session-store')
const LevelStore = levelSession(session)


import { UserHandler, User } from './user'
const dbUser: UserHandler = new UserHandler('./db/users')

const userRouter = express.Router()


const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use(morgan('dev'))

const port: string = process.env.PORT || '8080'

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//Test

app.get('/', (req: any, res: any) => {
  res.setHeader('Content-Type', 'text/plain')
  //res.render('hello', { name: req.session.username })
  //res.write('Hello world')
  res.send('Server is up!!!')
  res.end()
})
<<<<<<< HEAD
=======
app.get('/hello/:name', (req: any, res: any) =>{
  res.setHeader('Content-Type', 'text/plain')
  if(req.params.name === 'Clement') res.send('Hi! My name is Clement, I\'m a 5th year student at ECE Paris studying BigData & Analytics')
  else res.send('Hello ' + req.params.name) 
})


>>>>>>> 7f5b9918e1ff0c09b85f55110bae930ae541cfc5

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Metrics

app.get('/metrics/:id', (req: any, res: any, next:any) => {
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
<<<<<<< HEAD
    }
=======
    })
  })
  
  app.get('/metrics/:id', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
      if (err) {
        throw err
      }
      if(result===undefined) {
        res.write('no result')
        res.send()
      }
      else res.json(result)
    })
>>>>>>> 7f5b9918e1ff0c09b85f55110bae930ae541cfc5
  })
})

app.post('/metrics/:id', (req: any, res: any, next: any) => {
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


app.use((req: any, res: any) => {
  res.setHeader('Content-Type', 'text/plain')
  res.status(404).send('Error 404. Message not found.')
})


/// Keep it in the end ///
app.use((req: any, res: any) =>{
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
