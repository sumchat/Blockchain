/**
 * BlockController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

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
            let blockchain = new Blockchain();
            await blockchain.readChainData();
            const block = {
                 data: req.param("data"),
             };
            await blockchain.addBlock(block);
            var blkheight = blockchain.getBlockHeight();
	        var newblock = blockchain.getBlock(blkheight);
            return res.ok(newblock);
        }
        catch(error)
        {
         return res.serverError(error);
        }     
          
    }

};

