import { LevelDb } from "./leveldb"
import WriteStream from 'level-ws'

export class UserHandler {
    public db: any

    constructor(path: string) {
        this.db = LevelDb.open(path)
    }

    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if (err) throw callback(err)
            callback(null, User.fromDb(data))
        })
    }

    public save(user: User, callback: (err: Error | null) => void) {
        // TODO
    }
    public delete(username: string, callback: (err: Error | null) => void) {
        // TODO
    }
 
}
export class User {
    public username: string
    public email: string
    private password: string = ""

    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
        this.username = username
        this.email = email

        if (!passwordHashed) {
            this.setPassword(password)
        } else this.password = password
    }
    static fromDb(data: any): User {
        // Parse db result and return a User
    }

    public setPassword(toSet: string): void {
        // Hash and set password
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
    }
}