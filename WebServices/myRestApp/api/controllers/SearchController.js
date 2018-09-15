/**
 * SearchController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let BlockchainData = require('../models/BlockchainData.js');
const Blockchain = require('../models/simpleChain.js');

module.exports = {
    searchAddress: async function(req,res){
        //let body = req.body;
        let walletAddress = req.param("Address");
        console.log("address "+ walletAddress);
        try{  
            let block = null;
            
            let blockchain = new Blockchain();
            await blockchain.readChainData();            
           
           
            //search all the blocks except the genesis block because the
            // genesis block does not contain the star object
            

             block = blockchain.chain.filter(block => {
                   if (block.body && block.body.address === walletAddress)
                        return true;
                   
                });           
            
            
            return res.ok(block);
        }
      catch(error)
        {
         return res.serverError(error);
        }  
     },
     searchHash: async function(req,res){
        let blockhash = req.param("hash");
        try{  
            let block = null;
            
            let blockchain = new Blockchain();
            await blockchain.readChainData();                
            
             block = blockchain.chain.filter(block => {
                    return block.hash === blockhash;
                });                 
            
            
            return res.ok(block);
        }
      catch(error)
        {
         return res.serverError(error);
        }  
     },
     searchHeight: async function(req,res){
        let blockheight = req.param("height");
        try{  
            let block = null;
           
            let blockchain = new Blockchain();
            await blockchain.readChainData();
              
           if(blockheight < blockchain.chain.length)
            {
                block = blockchain.chain[blockheight];
                return res.ok(block);
            }
            else
            return res.ok("Error :Request failed because you requested for a Block greater than the chain length "+ blockchain.chain.length);     
            
            
            
        }
      catch(error)
        {
         return res.serverError(error);
        }  
     },
    

};

