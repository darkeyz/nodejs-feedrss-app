import config from './config'

/* Log system */
const log = class Log {
    constructor() {
        this.level = config.logLevel
    }

    error(el){
        if (this.level >= 1) {
            const color = "\x1b[31m%s\x1b[0m"
            console.error(color ,'ERROR: ' + el)
        }
    }
    
    info(el){
        if (this.level >= 2) {
            const color = "\x1b[36m%s\x1b[0m"
            console.info(color, 'Info: ' + el)
        }
    }

    debug(el){
        if(this.level >= 3){
            const color = "\x1b[33m%s\x1b[0m"
            console.log(color ,'Debug: ' + el)
        }
    }
}

export default new log()