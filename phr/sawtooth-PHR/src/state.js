const crypto = require('crypto')

class phrState {
	constructor(context){
		this.context=context
		this.addressCache=new Map([])
		this.timeout=500
	}
	
	getRecord(name){
		return this.loadRecord(name).then((records)=>records.get(name))
	}
	
	setRecord (name, records) {
		let address = makePhrAddress(name)
		return this.loadRecord(name).then((records)=>{
		  records.set(name,records)
			return records
		}).then((records)=>{
			let data = records
			this.addressCache.set(address,data)
			let entries = {
				[address] : data
			}
			return this.context.setState( entries, this.timeout)
			})
		}
			
	loadRecord (name){
	let address = name
	if (this.addressCache.has(address)){
	if (this.addressCache.get(address)=== null){
		return Promise.resolve (new Map([])).then(console.log("New map Created"))
	} else {
		return Promise.resolve (this.addressCache.get(address)).then(console.log("Starting deserialization"))
	}
	}else{
		return this.context.getState([ address], this.timeout)
		.then (( addressValues) => { 
			if (!addressValues[address].toString()) {
			this.addressCache.set(address, null)
		return new Map([])
	}	else{
			let data= addressValues[address].toString()
			this.addressCache.set(address, data)
			return data
		}
	})
	}
    }
  }
module.exports = { phrState}

