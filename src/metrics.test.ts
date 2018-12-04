import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDb } from "./leveldb"

const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {
    before(function () {
        LevelDb.clear(dbPath)
        dbMet = new MetricsHandler(dbPath)
    })
    after(function () {
        dbMet.db.close()
    })


    describe('#get', function () {
        it('should get empty array on non existing group', function () {
            dbMet.get("0", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.be.empty
            })
        })
    })

    describe('#save', function () {
        before(function () {
            dbMet.save(2, [
                { "timestamp": "1384686660000", "value": 10 }
            ], (err: Error | null) => {
                expect(err).to.be.undefined
            });
        })
        after(function () {
            dbMet.get("2", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).not.to.be.empty
            })
        })


        it('should save data', function () {
            dbMet.save(1, [
                { "timestamp": "1384686660000", "value": 10 }
            ], (err: Error | null) => {
                expect(err).to.be.undefined
            });
        })

        it('should update data', function () {
            dbMet.save(2, [
                { "timestamp": "1384686660001", "value": 10 }
            ], (err: Error | null) => {
                expect(err).to.be.undefined
            });
        })
    })

    describe('#delete', function () {
        before(function () {
            dbMet.save(3, [
                { "timestamp": "1384686660000", "value": 10 }
            ], (err: Error | null) => {
                expect(err).to.be.undefined
            });
        })
        after(function(){
            dbMet.get("3", function (err: Error | null, result?: Metric[]) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.be.empty
            })
        })


        it('should delete data', function () {
            dbMet.remove("3", (err: Error | null) => {
                expect(err).to.be.null
            })
        })

        it('should not fail if data does not exist', function () {
            dbMet.remove("undefined", (err: Error | null) => {
                expect(err).to.be.null
            })
        })
    })
})
