import express = require('express')
import { MetricsHandler } from './metrics'
import bodyparser= require('body-parser')

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())


const port: string = process.env.PORT || '8080'

const dbMet : MetricsHandler = new MetricsHandler('./db/metrics')

//////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/', (req: any, res: any) => {
  res.setHeader('Content-Type', 'text/plain')
  //res.render('hello', { name: req.session.username })
  //res.write('Hello world')
  res.send('/hello takes a name query parameter like this: /hello/yourname, a random names replies hello [name], /hello/Clement (my own name) replies with a short intro of myself')
  res.end()
})
app.get('/hello/:name', (req: any, res: any) =>{
  res.setHeader('Content-Type', 'text/plain')
  if(req.params.name === 'Clement') res.send('Hi! My name is Clement, I\'m a 5th year student at ECE Paris studying BigData & Analytics')
  else res.send('Hello ' + req.params.name) 
})



//////////////////////////////////////////////////////////////////////////////////////////////////////////

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
      if(result===undefined) {
        res.write('no result')
        res.send()
      }
      else res.json(result)
    })
  })


app.post('/metrics/:id', (req: any, res: any, next:any) => {
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
