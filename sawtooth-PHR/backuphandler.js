const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const {InternalError,InvalidTransaction}=require('sawtooth-sdk').exceptions;
const { hash } = require('./lib/helper');
const cbor= require('cbor');
const crypto = require('crypto');
const FAMILY_NAME = "phr-family", VERSION = ["1.0"], NAMESPACE = ["phr", "phrfam", hash(FAMILY_NAME)]
const mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

const url = 'mongodb://localhost:27017';
const dbName= 'phr';
//const client = new MongoClient(url);


const decodeData = (payload) =>{
	return new Promise((resolve,reject) =>{
	let decodedPayload=cbor.decode(payload)
	//console.log(decodedPayload)
        //let result = JSON.parse(decodedPayload);
	//console.log(result)
	let reason = new InvalidTransaction('Invalid payload')
	//decodedPayload ? resolve(decodedPayload):reject(reason);
	
	let payload1 = decodedPayload.toString().split(',')
	if(payload1){
		if(payload1[1]==="upload"){
			resolve({
				pid: payload1[0],
				action: payload1[1],
				category: payload1[2],
				age: payload1[3]
			})
		}
		else if(payload1[1]==="read"){
			resolve({
				docid: payload1[0],
				action: payload1[1]
			})
		}
		else if(payload1[1]==="request"){
			resolve({
				pid: payload1[0],
				action: payload1[1],
				category: payload1[2],
				docid: payload1[3]
			})
		}
		else{
			console.log("invalid action")
		}
	}
	else {
		let reason = new InvalidTransaction('Invalid payload serialization')
		reject(reason)
	}


	})
}

class PhrHandler extends TransactionHandler {
    constructor() {
       super(FAMILY_NAME, VERSION, NAMESPACE);
    }
    apply(transactionProcessRequest, context) {
        return decodeData(transactionProcessRequest.payload)
            .then((update)=> {
		//console.log(update)
		if ((!update.pid) && (!update.docid)){
                    throw new InvalidTransaction("Payload has no ID ");
                }
                if (!update.action){
                    throw new InvalidTransaction("Payload doesn't contain the action");
                }
                let action = (update.action).toString();
		//console.log(context)
                var address
                switch(action){
                    case "upload":
	                address = NAMESPACE[2] + hash(update.pid).substring(0,20)+ hash(update.category).substring(0,20) + hash(update.category).substring(0,24);
                        let entries = {
                            [address] : cbor.encode(update)
                        }
                        context.setState(entries);
			MongoClient.connect(url, function (err,client){
				if (err) {
					throw err;
				}
				else{	
					console.log("Connected correctly to server");
					const db=client.db(dbName);
					db.collection('uploads').insertOne({patientId:update.pid, category:update.category}, function(err,r){
					if (err) {
						throw err;
					}
					else{
						console.log("Connection closed");
						client.close();
					}
					});
				}
			});
			break;

                    case "read":
                        /*context.getState([address])
                            .then((possibleAddressValues)=>{
                                let stateValue = possibleAddressValues[address];
                                if(stateValue && stateValue.length){
                                    let value = cbor.decodeFirstSync(stateValue);
					 console.log(value[id])
                                    if(value[id]){
                                        console.log(value.age)
                                    }
                                    else{
                                        throw new InvalidTransaction("Invalid Transaction")
                                    }
                                }
                            }) 
*/
			address = NAMESPACE[2] + hash(update.docid).substring(0,20);
			let readentries = {
                            [address] : cbor.encode(update)
                        }
                        context.setState(readentries);
			context.getState(readentries);
			/*var token
			var temp = context.getState(readentries).then(token => {return token
				console.log(token)
				console.log(context.getState(readentries))}
);*/
			
			/*MongoClient.connect(url, function (err,client){
				if (err) {
					throw err;
				}
				else{
					console.log("Connected correctly to server");
					const db=client.db(dbName);
					db.collection('uploads').find({}).toArray(function(err,result){
						if(err){
							throw err;
						}
						else{
							console.log(result)
							console.log("Connection closed");
							client.close();
						}
					});
				}
			});*/
			
			break;                      

                    default:
			//console.log(update.action)
                    throw new InvalidTransaction("The action is not supported/invalid");
                }
            })
            .catch((err) => {
                throw new InternalError(err);
            })
    }
}
 
module.exports = PhrHandler
