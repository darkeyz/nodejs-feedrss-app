import axios from 'axios'
import { DOMParser } from 'xmldom'

//Api keys
const api_url = 'https://content.guardianapis.com/search'
const api_key = 'e8e99174-a76b-4eb4-801f-c6998511fe70'

//Main request function 
const main = async (url) => {
    console.log("URL:", url)
    const uppercase = url.match(/[A-Z]/)
    let status, msg, validUrl,validRss
    if (uppercase !== null || !url.match(/[a-z]+/)) {
        console.log("Url not valid")
        status = 404
        msg = "Url not valid"
    } else {
        let feeds = await getFeeds(url)
        validRss = await validateFeeds(feeds)
        validRss = new DOMParser().parseFromString(validRss, 'text/xml').documentElement.getElementsByTagName('m:validity')[0].textContent

        if (validRss !== "true") {
            console.log("RSS not valid")
            status = 500
            msg = "RSS not valid"
        } else {
            console.log("RSS valid")
            status = 200
            msg = feeds
        }
    }
    return { status, msg }
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
        //console.log(i);
        feedsXml += "<item>"
        //feedsXml += "<title>" + feeds[i].webTitle.replace('&','&amp;') + "</title>"
        feedsXml += "<title>" + replaceSpecialChars(feeds[i].webTitle) + "</title>"
        feedsXml += "<description>" + replaceSpecialChars(feeds[i].webTitle) + "</description>"
        feedsXml += "<link>" + replaceSpecialChars(feeds[i].webUrl) + "</link>"
        feedsXml += "</item>"
        //console.log>feedsXml);
    }

    feedsXml += "</channel>"
    feedsXml += "</rss>"
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
                console.log(error);
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
            resolve(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
    });
}

export { main }