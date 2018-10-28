const { TransactionProcessor } = require('sawtooth-sdk/processor');
const  PhrHandler = require('./src/phr_handler');
//import PhrHandler from './src/phr_handler' ; 
const transactionProcessor = new TransactionProcessor('tcp://localhost:4004');


//Add Transaction Processor Handler to TP
transactionProcessor.addHandler (new PhrHandler());
//Start Transaction Processor
transactionProcessor.start();

//Handle Stop Process
process.on('SIGUSR2', () => {
    transactionProcessor._handleShutdown();
})
