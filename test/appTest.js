import { assert } from 'chai'
import { expect } from 'chai'

//Function to test
import { main, replaceSpecialChars, toXmlRss } from '../src/modules/app'

describe('App',() => {

    describe('#main',() =>{
<<<<<<< HEAD
        it.skip('should return Invalid Url with status 404',async () => {
=======
        it('should return Invalid Url with status 404',async () => {
>>>>>>> 10aebfa4e67d0f532543acb598c65c7127be5e40
            const res1 = await main("UPPeRCaSE")
            const res2 = await main("uppercasE") 
            expect(res1).to.deep.include({ status: 404, msg: "Url not valid"})
            expect(res2).to.deep.include({ status: 404, msg: "Url not valid"})
        })

<<<<<<< HEAD
        it.skip('should return status 200',async () => {
=======
        it('should return status 200',async () => {
>>>>>>> 10aebfa4e67d0f532543acb598c65c7127be5e40
            const res = await main("lowercase")
            expect(res).to.deep.include({ status: 200})
        })
    })

    describe('#replaceSpecialChars',() =>{
        it('should return entities', () => {
            expect(replaceSpecialChars("azer&t<>'")).to.be.equals("azer&amp;t&lt;&gt;&apos;")
        })
    })

    describe('#toXmlRss',() =>{
        it('should return valid Xml Rss', () => {
            const title = "title"
            const url = "blablabla.it"

            let feedsXml = "<?xml version='1.0' encoding='UTF-8' ?><rss version = '2.0' >"
            feedsXml += "<channel>"
            feedsXml += "<title>" + "The Guardian news" + "</title>"
            feedsXml += "<description>" + "Latest international news, sport and comment from the Guardian" + "</description>"
            feedsXml += "<link>" + "https://www.theguardian.com" + "</link>"
            feedsXml += "<item>"
            feedsXml += "<title>" + title + "</title>"
            feedsXml += "<description>" + title + "</description>"
            feedsXml += "<link>" + url + "</link>"
            feedsXml += "</item>"
            feedsXml += "</channel>"
            feedsXml += "</rss>"

            expect(toXmlRss([
                {webTitle: title,webUrl: url}
            ])).to.be.equals(feedsXml)
        })
    })

    describe('#replaceSpecialChars', () => {
        it('should return entities', () => {
            expect(replaceSpecialChars("azer&t<>'")).to.be.equals("azer&amp;t&lt;&gt;&apos;")
        })
    })
    
})
