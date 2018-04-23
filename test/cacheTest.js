import { assert } from 'chai'
import { expect } from 'chai'

//Function to test
import cache from '../src/modules/cache'

describe('Cache', () => {
    const RSScache = new cache() 
    RSScache.set("pippo", 'pluto', 20)

    it('should return cache value',() => {
        expect(RSScache.get("pippo")).to.be.equals('pluto')
    })
})

describe('Cache expired', () => {
    const RSScache = new cache() 
    RSScache.set("paperino", 'pluto', 50)
    before((done) => {
        setTimeout(() => {
            done()
        }, 100);
    })
    it('should return false', () => {
        expect(RSScache.get("paperino"), 'value still cached').to.be.false
    })
})