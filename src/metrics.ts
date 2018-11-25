import LevelDb = require('./leveldb')
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
    
    private db: any 

    constructor(dbPath: string) {
      this.db = LevelDb.open(dbPath)
    }

    public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db)
    
        stream.on('error', callback)
        stream.on('close', callback)
    
        metrics.forEach(m => {
          stream.write({ key: `metrics:${key}${m.timestamp}`, value: m.value })
        })
    
        stream.end()

        //or
        // met.forEach(m:Metric)=>{
        //     this.db.put(`metrics:${key}${m.timestamp}`, value: m.value )
        // }
      }

    static get(callback: (error: Error | null, result?: Metric[]) => void) {
      const result = [
        new Metric('2013-11-04 14:00 UTC', 12),
        new Metric('2013-11-04 14:30 UTC', 15)
      ]
      callback(null, result)
    }
  }