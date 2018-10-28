const crypto = require('crypto');

const decodeData=(payload)=>{
    return new Promise((resolve,reject)=>{
	//console.log(payload);
        let result = JSON.parse(payload);
	result ? resolve(result):reject(result);
	payload = payload.toString().split(',')
/*	if(payload){
		resolve({
		pid:payload[0],
		action:payload[1],
		category:payload[2],
		age:payload[3]
		})
	}
	else {
		let reason = new InvalidTransaction('Invalid payload serialization')
		reject(reason)
	}
*/
	})
}

const hash =(x)=>crypto.createHash('sha512').update(x).digest('hex').toLowerCase();

module.exports={
    decodeData,
    hash
}
