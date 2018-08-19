/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
const level = require('level');
const SHA256 = require('crypto-js/sha256');
const chainDB = '../chaindata';
const db = level(chainDB);


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.data = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

//wrap the readablestream of Key-value pairs in a promise
const readstream = () => new Promise((resolve,reject) => {
	let output = [];
	db.createReadStream()
			.on('data', data => { output.push({ key: data.key, value: data.value }); })
			.on('error', err => {
													console.log('Unable to read data stream!',err);
													reject(new Error('Error while reading datastream'));})
			.on('end', () => { resolve(output); });
});

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/


	class Blockchain{
		  constructor(){				
		    this.chain = [];//blocks added to the db are also stored in the array
				this.tempArray =[];//initially the blocks are stored in this array. Then
				//they are added asynchronously to the db from this temp array.
				//var self = this;
		    this.processing = false;//this is a flag which controls the adding of the
				//block to the db.Once a block is added then the addition of the next block starts.
		    


		  }

			async readChainData(){
				try{
				var results = await readstream();
				var output = [];
				output = results;
				console.log("length " + output.length);
				 var self = this;
				 output.sort(function(a,b){return a.key - b.key});
				 output.forEach(function(obj){
						 var blockObj = JSON.parse(obj.value);
					//console.log("added to chain");	 
					 self.chain.push(blockObj);
					 
					 });
					 
					 //console.log("  ..chain length "+ this.chain.length);
				 	//if the chain length is 0 add the genesis block
				 	if (this.chain.length == 0)
					 		{
				    	await	this.addBlock(new Block("First block in the chain - Genesis block"));
				  		}

					}
				catch(err){
					console.log("Error occurred while reading chainData "+ err);
			 	}
		}

		  async  addLevelDBData(newBlock){
		   try{
				var key = this.chain.length;
				//console.log("chain length " + key);
				newBlock.height = key;
		    // UTC timestamp
		    newBlock.time = new Date().getTime().toString().slice(0,-3);
		    // previous block hash
		    if(this.chain.length>0){
		      newBlock.previousBlockHash = this.chain[this.chain.length-1].hash;
		    }
		    // Block hash with SHA256 using newBlock and converting to a string
		    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

				var blkval = JSON.stringify(newBlock);

				 var resp = await db.put(key, blkval);
					var val = await db.get(key);
					var obj = JSON.parse(val);
					 this.chain.push(obj);
					 //console.log("pushed "+ key);
				 this.processing = false;
				 this.tempArray.splice(0,1);
			   this.processArray();
			 } catch(err){
				 console.log("Error occurred while adding the block to the database "+ err);
			  }
			}


	async processArray(){
		
		if(this.tempArray.length > 0){
			//console.log("process .." + this.tempArray.length);
			var nextBlock = this.tempArray[0];
			this.processing = true;
			await this.addLevelDBData(nextBlock);
			
		}
	}

	

	  // Add new block
	  async addBlock(newBlock){
			console.log("add block ..");
			try{
	    this.tempArray.push(newBlock);
			if(this.processing == false){
				await this.processArray();
				}
			
	   	}	catch(err){
			  console.log("error while adding block");
			 return new Error("error while adding block");
		  }
	  }

	  // Get block height
	    getBlockHeight(){
				//console.log("height..: "+ this.chain.length);
				
	      return this.chain.length-1;
	    }

	    // get block
	    getBlock(blockHeight){
				// return object as a single string
				if(blockHeight >= this.chain.length)
				{
				return new Error("Request failed because you requested for a Block greater than the chain length "+ this.chain.length);
				}
				else
	      return JSON.parse(JSON.stringify(this.chain[blockHeight]));
	    }

	    // validate block
	    validateBlock(blockHeight){
				try{
	      // get block object
	      let block = this.getBlock(blockHeight);
	      // get block hash
	      let blockHash = block.hash;
	      // remove block hash to test block integrity
	      block.hash = '';
	      // generate block hash
	      let validBlockHash = SHA256(JSON.stringify(block)).toString();
	      // Compare
	      if (blockHash===validBlockHash) {
	          return true;
	        } else {
	          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
	          return false;
	        }
				}	catch(err){
					console.log("Error occurred during validation. " + err);
				}
	    }

	   // Validate blockchain
	    validateChain(){
	      let errorLog = [];
	      for (var i = 0; i < this.chain.length-1; i++) {
	        // validate block
	        if (!this.validateBlock(i)) errorLog.push(i);
	        // compare blocks hash link
	        let blockHash = this.chain[i].hash;
	        let previousHash = this.chain[i+1].previousBlockHash;
	        if (blockHash!==previousHash) {
	          errorLog.push(i);
	        }
	      }
	      if (errorLog.length>0) {
	        console.log('Block errors = ' + errorLog.length);
	        console.log('Blocks: '+errorLog);
	      } else {
	        console.log('No errors detected');
	      }
	    }
	}

	module.exports = Blockchain