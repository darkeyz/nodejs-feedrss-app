import log from "./log"

/* Memory only cache */
const cache = class Cache{
    
	constructor() {
		this.entries = {}
	}

	get(key) {
		return (this.entries[key] !== undefined) ? this.entries[key] : false 
	}

	set(key , value, timeout) {
		const self = this 
		this.entries[key] = value

		if(timeout){
			setTimeout(() => {
				log.info("Cache for " + key + " expired!!")
				self.delete(key) 
			}, timeout)
		}
	}

	delete(key) {
		delete this.entries[key]
	}
}

export default cache