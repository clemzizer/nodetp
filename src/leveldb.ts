import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'


export class LevelDb {
  static open(path: string) {
    const encoded = encoding(leveldown(path), { valueEncoding: 'json' })
    return levelup(encoded)
  }

}