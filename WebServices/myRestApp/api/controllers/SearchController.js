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
            let blocks = null;
            
            let blockchain = new Blockchain();
            await blockchain.readChainData();            
           
           
            //search all the blocks except the genesis block because the
            // genesis block does not contain the star object
            

             blocks = blockchain.chain.filter(block => {
                   if (block.body && block.body.address === walletAddress)
                        return true;
                   
                });   
            let allblocks = blocks.map(block =>{
                    const {body, ...rest} = block;
                    console.log("story.." + body["star"]["story"]);
                    body["star"]["storyDecoded"] = module.exports.hex2a(body["star"]["story"]);
                    return {
                       ...rest,
                       body,
                    };
                   
                    });        
            
            
            return res.ok(allblocks);
        }
      catch(error)
        {
         return res.serverError(error);
        }  
     },
     searchHash: async function(req,res){
        let blockhash = req.param("hash");
        try{  
            let blocks = null;
            
            let blockchain = new Blockchain();
            await blockchain.readChainData();                
            
             blocks = blockchain.chain.filter(block => {
                    return block.hash === blockhash;
                });                 
             let allblocks = blocks.map(block =>{
                 const {body, ...rest} = block;
                 console.log("story.." + body["star"]["story"]);
                 body["star"]["storyDecoded"] = module.exports.hex2a(body["star"]["story"]);
                 return {
                    ...rest,
                    body,
                 };
                
                 });
             
             return res.ok(allblocks);
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
                block["body"]["star"]["storyDecoded"] = module.exports.hex2a(block["body"]["star"]["story"]);
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
     
     hex2a:function(hexx) {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
    

};

