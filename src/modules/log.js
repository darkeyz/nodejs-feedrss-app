import config from "./config"
import fs from "fs"

/* Log system */
const log = class Log {
	constructor() {
		this.level = config.logLevel
	}

	//Log error in console and save in file 
	error(el) {
		if (this.level >= 1) {
			const color = "\x1b[31m%s\x1b[0m"
			const log = "Error: " + el
			console.error(color, log)
			this.writeLog(log)
		}
	}

	//Log info in console and save in file
	info(el) {
		if (this.level >= 2) {
			const color = "\x1b[36m%s\x1b[0m"
			const log = "Info: " + el
			console.info(color, log)
			this.writeLog(log)
		}
	}

	//Log debug in console and save in file
	debug(el) {
		if (this.level >= 3) {
			const color = "\x1b[33m%s\x1b[0m"
			const log = "Debug: " + el
			console.log(color, log)
		}
	}

	//Write log in file 
	writeLog(log) {
		let date = new Date()
		const month = (date.getMonth() < 10) ? "0" + date.getMonth() : date.getMonth()
		const day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate()
		const currentDay = [date.getFullYear(), month, day].join("-")
		const currentHour = [date.getHours(), date.getMinutes(), date.getSeconds()].join(":")

		const file = "./src/log/log-" + currentDay + ".json"
		const fileExists = fs.existsSync(file)

		//Check if file exists and create it with empty json
		let json = {}
		if (!fileExists) {
			try {
				fs.writeFileSync(file, JSON.stringify(json))
			} catch (err) {
				console.error(err)
			}
		}

		//read file
		json = fs.readFileSync(file)
		json = JSON.parse(json)

		//check if key is already set 
		if (json[currentHour] === undefined) {
			json[currentHour] = []
		}
		json[currentHour].push(log)

		//append log
		try {
			fs.writeFileSync(file, JSON.stringify(json))
		} catch (err) {
			console.error(err)
		}
	}

}

export default new log()