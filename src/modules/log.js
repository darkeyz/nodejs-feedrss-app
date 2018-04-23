import config from './config'

/* Log system */
const log = class Log {
    constructor() {
    }

    
    error(el){
        console.log('ERROR: ' + el)
    }
    
    info(el){
        console.log('INFO: ' + el)
    }

    debug(el){
        console.log('DEBUG: ' + el)
    }
}

export default new log()