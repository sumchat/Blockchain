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
            
             if(blockchainId)
             {
             let respObj = {};
             if (BlockchainData.validated.includes(blockchainId)) //if the user has his request validated and signature verified
             {
                respObj.message = "This address is already validated. Go ahead and register a star";
                return res.ok(respObj);
             }
             else{
                     if (blockchainId in BlockchainData.validationBlocks)//if user has initiated request for validation 
                        {
                            let validationReqBlock = BlockchainData.validationBlocks[blockchainId];//get the request from the stored object
                            //check if the user is verified or not
                
                 
                            if (BlockchainData.validatedRequest.includes(blockchainId))//if signature is verified the validate it
                                {
                                 respObj.address = validationReqBlock.userId;
                                respObj.message = validationReqBlock.userId + ":" + validationReqBlock.timeStamp + ":starRegistry";
                                respObj.requestTimestamp =  validationReqBlock.timeStamp;
                                respObj.ValidationWindow = 300000 - (time - validationReqBlock.timeStamp); 
                                 BlockchainData.validated.push(blockchainId);//add to the validated queue
                                 BlockchainData.validatedRequest.pop(blockchainId);//remove the verified request
                                 delete BlockchainData.validationBlocks[blockchainId];//remove the initial request
                                 console.log("valBlk:" + BlockchainData.validationBlocks[blockchainId]);
                                 }                         
                            else
                                 {
                                 respObj.address = blockchainId,
                                 respObj.message = blockchainId + ":" + validationReqBlock.timeStamp + ":starRegistry <- Please sign this message on the left to prove your identity";
                                 respObj.requestTimestamp =  validationReqBlock.timeStamp;
                                 respObj.ValidationWindow = 300000 - (time - validationReqBlock.timeStamp); //reduce the time window
                                 }
                         }
                
             
                    else{
                            //if not then start the initial request
                            const validationReqBlock = {
                            userId: blockchainId,
                            timeStamp: time,
                             message:blockchainId + ":" + time + ":starRegistry"
                             };

                             BlockchainData.validationBlocks[blockchainId] = validationReqBlock;
                            //set a timeout of 5 minutes i.e 5 * 60 * 1000 to remove the request from validation routine if not validated
                            setTimeout(function(){
                            delete BlockchainData.validationBlocks.blockchainId;
                            //BlockchainData.validationBlocks[blockchainId] = null;
                             },300000);
                            //blockchainId + ":" + validationBlock.time +":" + "starRegistry";
             
                             respObj.address = blockchainId,
                            respObj.message = validationReqBlock.userId + ":" + validationReqBlock.timeStamp + ":starRegistry <- Please sign this message on the left to prove your identity";
                            respObj.requestTimestamp =  validationReqBlock.timeStamp;
                            respObj.ValidationWindow = 300000; 
                        }
                        return res.ok(respObj);
               
             }
             
            }
            else{
                    return res.ok("{Error: No values supplied for BlockchainId}");
                 }
            }
        catch(error)
          {
           return res.serverError(error);
          }  
       },

};

