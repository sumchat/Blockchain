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
             let body = req.body;//req.param("BlockchainId");
             let blockchainId = body.address;
             console.log("chainid:" + blockchainId);
            let time = Math.floor(Date.now() / 1000);//time in seconds
            // let time = new Date().getTime().toString().slice(0,-3);
             //let timeinsecs = new Date().getTime().toString().slice(0,-3);
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
                        if (blockchainId in BlockchainData.validationBlocks)//if the user has made the initial request
                         {  
                            let validateBlock = BlockchainData.validationBlocks[blockchainId];                            
                            respObj.address= validateBlock.userId;
                            respObj.requestTimestamp = validateBlock.timeStamp;
                            respObj.message= validateBlock.userId + ":" + validateBlock.timeStamp + ":starRegistry";
                            respObj.validationWindow= 300 - (time - validateBlock.timeStamp);
                            return res.ok(respObj);            
                                         
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
                                    delete BlockchainData.validationBlocks[blockchainId];                            
                                 },300000);
                                
                 
                                respObj.address = blockchainId,                            
                                respObj.requestTimestamp =  validationReqBlock.timeStamp;
                                respObj.message = validationReqBlock.userId + ":" + validationReqBlock.timeStamp + ":starRegistry";
                                respObj.validationWindow = 300; //in seconds
                                return res.ok(respObj);

                            }
                   
                            
                    }
                       
               
                }          
            
            else{
                    return res.ok("{Error: No values supplied for address}");
                 }
            }
        catch(error)
          {
           return res.serverError(error);
          }  
       },

};

