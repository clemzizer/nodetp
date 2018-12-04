//import LevelDb = require('./leveldb')
import { LevelDb } from './leveldb'
import WriteStream from 'level-ws'



export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {

  public db: any

  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)

    stream.on('error', callback)
    stream.on('close', callback)

    metrics.forEach(m => {
      stream.write({ key: `metrics:${key}:${m.timestamp}`, value: m.value })
    })

    stream.end()

    /*   or
    met.forEach(m:Metric)=>{
        this.db.put(`metrics:${key}${m.timestamp}`, value: m.value )
    } */
  }

  public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []

    stream.on('error', callback)
      .on('end', (err: Error) => {
        callback(null, met)
      })
      .on('data', (data: any) => {
        const [_, k, timestamp] = data.key.split(":")
        const value = data.value

        if (key != k) {
          console.log(`LevelDB error: ${data} does not match key ${key}`)
        } else {
          met.push(new Metric(timestamp, value))
        }
      })
  }

  public remove(key: string, callback: (err: Error | null) => void) {
    const readStream = this.db.createReadStream()
    var met: Metric[] = []

    readStream.on('error', callback)
      .on('data', (data: any) => {
        const [_, k, timestamp] = data.key.split(":")
        const value = data.value

        if (key != k) {
          console.log(`LevelDB error: ${data} does not match key ${key}`)
        } else {
          this.db.del(`metrics:${key}:${timestamp}`, (err)=>{if(err)throw(err)})
        }
      })

    
    const stream = this.db.createKeyStream()
    .on('data', function (data) {
      console.log('key=', data)
    })
    callback(null)
  }
}