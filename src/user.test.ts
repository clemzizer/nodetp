import { expect } from 'chai'
import { LevelDb } from "./leveldb"
import { UserHandler, User } from './user';

const dbPath: string = 'db_test'
var dbUser: UserHandler

describe('Users', function () {
    before(function () {
        LevelDb.clear(dbPath)
        dbUser = new UserHandler(dbPath)

    })
    after(function () {
        dbUser.db.close()
    })


    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbUser.get("idonotexist", function (err: Error | null, result?: User) {
                //expect(err).to.be.null
                //expect(result).to.not.be.undefined
                //expect(result).to.not.be.empty
            })
        })
    })

    describe('#save', function () {
        before(function () {
            let usr = new User("Iwillexist", "", "")
            dbUser.save(usr, (err: Error | null) => {
                 //expect(err).to.be.undefined
            });
        })
        after(function () {
            dbUser.get("Iwillexist", function (err: Error | null, result?: User) {
                 //expect(err).to.be.null
                //  expect(result).to.not.be.undefined
                //  expect(result).not.to.be.empty
            })
        })
        it('should save data', function () {
            let usr = new User("newuser", "", "")
            dbUser.save(usr, (err: Error | null) => {
                 //expect(err).to.be.undefined
            });
        })

        it('should update data', function () {
            let usr = new User("Iwillexist", "", "")
            dbUser.save(usr, (err: Error | null) => {
                 //expect(err).to.be.undefined
            });
        })
    })

    describe('#delete', function () {
        before(function () {
            let usr = new User("testtodelete", "", "")
            dbUser.save(usr, (err: Error | null) => {
                 //expect(err).to.be.undefined
            });
        })
        after(function () {
            dbUser.get("testtodelete", function (err: Error | null, result?: User) {
                //expect(result).to.not.be.undefined
            })
        })


        it('should delete data', function () {
            dbUser.delete("testtodelete", (err: Error | null) => {
                //expect(err).to.be.undefined
            })
        })

        it('should not fail if data does not exist', function () {
            dbUser.delete("undefined", (err: Error | null) => {
                //expect(err).to.be.undefined
            })
        })
    })
})
