import express = require('express')
import { MetricsHandler } from './metrics'
import bodyparser= require('body-parser')

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())


const port: string = process.env.PORT || '8080'

const dbMet : MetricsHandler = new MetricsHandler('./db/metrics')

app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

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
        res.send
      }
      else res.json(result)
    })
  })


app.post('/metrics/:id', (req: any, res: any) => {
    dbMet.save(req.params.id, req.body, (err: Error | null, result?: any) => {
      if (err) {
        res.status(500).send(err.message)
      }
      //res.json(result)
      res.status(200).send()
    });
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