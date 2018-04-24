import axios from 'axios'
import { DOMParser } from 'xmldom'
import cache from './cache'
import log from './log'

const RSSCache = new cache();

//Api keys
const api_url = 'https://content.guardianapis.com/search'
const api_key = 'e8e99174-a76b-4eb4-801f-c6998511fe70'

//Main request function 
const main = async (url) => {
    if(url !== "/favicon.ico"){
        log.info("Url -> " + url)
    }
    let status, msg, validUrl,validRss
    const uppercase = url.match(/[A-Z]/)
    if (uppercase !== null || !url.match(/[a-z]+/)) {
        log.info("Url not valid")
        status = 404
        msg = "Url not valid"
    } else if (url === "/favicon.ico"){
        status = 200
        log.debug("favicon.ico")
        msg = "favicon.ico"
    } else {
        let feeds = RSSCache.get(url) 
        if (!feeds) {
            feeds = await getFeeds(url)
            validRss = await validateFeeds(feeds)
            validRss = new DOMParser().parseFromString(validRss, 'text/xml').documentElement.getElementsByTagName('m:validity')[0].textContent
            if (validRss !== "true") {
                log.info("RSS not valid")
                status = 500
                msg = "RSS not valid"
            } else {
                log.info("RSS valid new")
                status = 200
                msg = feeds
            }
            //RSSCache.set(url, feeds, 10000)
            RSSCache.set(url, feeds, 600000)
        }else{
            log.info("RSS valid cached")
            status = 200
            msg = RSSCache.get(url);
        }

    }
    const response = { status, msg }
    return response
}

//Replace xml special characters in entities
const replaceSpecialChars = function (str) {
    return str.replace('<', '&lt;')
        .replace('&', '&amp;')
        .replace('>', '&gt;').
        replace('\"', '&quot;')
        .replace('\'', '&apos;')
}

//Create xml from The guardian data
const toXmlRss = (feeds) =>{
    let feedsXml = "<?xml version='1.0' encoding='UTF-8' ?><rss version = '2.0' >"

    feedsXml += "<channel>"
    feedsXml += "<title>" + "The Guardian news" + "</title>"
    feedsXml += "<description>" + "Latest international news, sport and comment from the Guardian" + "</description>"
    feedsXml += "<link>" + "https://www.theguardian.com" + "</link>"

    for (let i = 0; i < feeds.length; i++) {
        feedsXml += "<item>"
        feedsXml += "<title>" + replaceSpecialChars(feeds[i].webTitle) + "</title>"
        feedsXml += "<description>" + replaceSpecialChars(feeds[i].webTitle) + "</description>"
        feedsXml += "<link>" + replaceSpecialChars(feeds[i].webUrl) + "</link>"
        feedsXml += "</item>"
    }

    feedsXml += "</channel>"
    feedsXml += "</rss>"

    log.debug(feedsXml)
    return feedsXml;
}

//Get feeds from The Guardian
const getFeeds = (url) =>{
    return new Promise(resolve => {
        const param = url.split('/');
        axios.get(api_url, {
            params: {
                q: param[1],
                'api-key': api_key,
                'format': 'json',
            }
            })
            .then((response) =>{
                const data = response.data
                let feeds = response.data.response.results
                resolve(toXmlRss(feeds))
            })
            .catch(function (error) {
                log.error(error);
            });
    });
}

//Validate RSS from w3 SOAP validator service
const validateFeeds = (feeds) => {
    return new Promise(resolve => {
        const uri = "http://validator.w3.org/feed/check.cgi"
        axios.get(uri, {
            params: {
                rawdata: feeds,
                output: "soap12",
            }
        })
        .then((response) => {
            log.debug(response.data)
            resolve(response.data)
        })
        .catch(function (error) {
            log.error(error);
        });
    });
}

export { main, replaceSpecialChars, toXmlRss }