/**
 * BlockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let BlockchainData = require('../models/BlockchainData.js'); 
const Blockchain = require('../models/simpleChain.js');


module.exports = {
    /**
     * list one block
     * @param req
     * @param res
     */
  getBlock:async function(req,res){
      try{
            const id = req.param("id");
            let blockchain = new Blockchain();
            await blockchain.readChainData();
            let block = blockchain.getBlock(id);
            return res.ok(block);
        }
      catch(error)
        {
         return res.serverError(error);
        }  
     },

  /**
     * create a new block
     * @param req
     * @param res
     */
  addBlock:async function(req,res){
      try{

        let body = req.body;

           let address = body.address;//req.param("WalletAddress");
           let star = body.star;
           if (!address)
            return res.ok("{Error:No values supplied for address}");
           if (BlockchainData.validated.includes(address)){
                //if (address in validateBlockContainer.validated){
                //let star = req.param("star");
                if (!star)
                return res.ok("{Error:No values supplied for Star }");
                //check for star properties
                let emptyFields = [];
                if (!address) 
                emptyFields.push("address");
            
                if (!star.ra) 
                emptyFields.push("right_ascension(ra)");
            
                if (!star.dec)
                emptyFields.push("declination(dec)");

                if (!star.story)
                emptyFields.push("story");
           
                if(emptyFields.length > 0)
                {
                    const missingfields = emptyFields.join();
                    errorStr = "Request failed because no values were supplied for - " + missingfields;
                 return res.ok("error:" + errorStr );
                  
                }
                else{
                    let blockchain = new Blockchain();
                    await blockchain.readChainData();
                     let story = star.story;
                    let hexStory = module.exports.a2hex(story);
                    star.story = hexStory;
                    const block = {
                    body: {
                      address,
                      star
                         }
                     };
                     await blockchain.addBlock(block);
                     let blkheight = blockchain.getBlockHeight();
                    let newblock = blockchain.getBlock(blkheight);
                    BlockchainData.validated.pop(address); //user can request one star for each validation request
                    delete BlockchainData.validationBlocks[address];
                    return res.ok(newblock);
                 }
             }
           else{
            let respObj = {};
            respObj.message = "Record not found. Please try the validateRequest first. You can register only one star for each validation"; 
            return res.ok(respObj);
           }  
           
        }
        catch(error)
        {
         return res.serverError(error);
        }     
          
    },

    
    //http://stackoverflow.com/questions/3745666/how-to-convert-from-hex-to-ascii-in-javascript

    a2hex:function (str) {
        var arr = [];
     for (var i = 0, l = str.length; i < l; i ++) {
         var hex = Number(str.charCodeAt(i)).toString(16);
         arr.push(hex);
        }
     return arr.join('');
    }

};

