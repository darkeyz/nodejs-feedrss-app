import config from './config'
import fs from 'fs'

/* Log system */
const log = class Log {
    constructor() {
        this.level = config.logLevel
    }

    error(el){
        if (this.level >= 1) {
            const color = "\x1b[31m%s\x1b[0m"
            const log = 'Error: ' + el
            console.error(color , log)
        }
    }
    
    info(el){
        if (this.level >= 2) {
            const color = "\x1b[36m%s\x1b[0m"
            const log = 'Info: ' + el
            console.info(color, log)
            this.writeLog(log)
        }
    }

    debug(el){
        if(this.level >= 3){
            const color = "\x1b[33m%s\x1b[0m"
            const log = 'Debug: ' + el
            console.log(color , log)
        }
    }

    writeLog(log){
        let date = new Date();
        const month = (date.getMonth() < 10) ? '0' + date.getMonth() : date.getMonth()
        const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
        const currentDay = [date.getFullYear(), month, day].join('-')
        const currentHour = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':') 

        const file = './src/log/log-' + currentDay + '.json'
        fs.open(file, 'r+', function (err, fd) {
            if (err) {
                let json = {}
                json[currentHour] = []
                json[currentHour].push(log)
                fs.writeFile(file, JSON.stringify(json), function (err) {
                    if (err) {console.log(err);}
                });
            } else {
                fs.readFile(file, function (err, data) {
                    let json = JSON.parse(data)
                    if (typeof json[currentHour] === "undefined"){
                        json[currentHour] = []
                    }
                    json[currentHour].push(log)
                    fs.writeFile(file, JSON.stringify(json))
                })
            }
        });
    }
}

export default new log()