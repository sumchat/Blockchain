/**
 * ValidateController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let BlockchainData = require('../models/BlockchainData.js');

module.exports = {
  /**
     * list one block
     * @param req
     * @param res
     */
    requestValidation: async function(req,res){
        try{
             let blockchainId = req.param("BlockchainId");
             let time = new Date().getTime().toString().slice(0,-3);
             //check if the request is already there or not
             //let starRequest = validateBlockContainer.validationBlocks[blockchainId];
             let respObj = {};
             if (blockchainId in BlockchainData.validationBlocks)
             {
                 let validationReqBlock = BlockchainData.validationBlocks[blockchainId];
                 //check if the user is verified or not
                 if (BlockchainData.validatedRequest.includes(blockchainId))
                 {
                    respObj.address = validationReqBlock.userId;
                    respObj.message = validationReqBlock.userId + ":" + validationReqBlock.timeStamp + ":starRegistry";
                    respObj.requestTimestamp =  validationReqBlock.timeStamp;
                    respObj.ValidationWindow = 300000 - (time - validationReqBlock.timeStamp); 
                    BlockchainData.validated.push(blockchainId);
                 }
                 else
                 {
                    respObj.address = blockchainId,
                    respObj.message = blockchainId + ":" + validationReqBlock.timeStamp + ":starRegistry <- Please sign this message on the left to prove your identity";
                    respObj.requestTimestamp =  validationReqBlock.timeStamp;
                    respObj.ValidationWindow = 300000 - (time - validationReqBlock.timeStamp); 
                 }
                
             }
             else{
                 //if not then restart the process
                const validationReqBlock = {
                    userId: blockchainId,
                    timeStamp: time,
                    message:blockchainId + ":" + time + ":starRegistry"
                    };

                    BlockchainData.validationBlocks[blockchainId] = validationReqBlock;
                //set a timeout of 5 minutes i.e 5 * 60 * 1000 to remove the request from validation routine if not validated
                setTimeout(function(){
                    BlockchainData.validationBlocks[blockchainId] = null;
                 },300000);
                 //blockchainId + ":" + validationBlock.time +":" + "starRegistry";
             
                respObj.address = blockchainId,
                respObj.message = validationReqBlock.userId + ":" + validationReqBlock.timeStamp + ":starRegistry <- Please sign this message on the left to prove your identity";
                respObj.requestTimestamp =  validationReqBlock.timeStamp;
                respObj.ValidationWindow = 300000; 
                 }
                return res.ok(respObj);
            }
        catch(error)
          {
           return res.serverError(error);
          }  
       },

};

