/**
 * MessageSignatureController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')

let BlockchainData = require('../models/BlockchainData.js');

module.exports = {
  /**
     * list one block
     * @param req
     * @param res
     */
    validate: async function(req,res){
        try{
             let walletAddress = req.param("WalletAddress");
             let signature = req.param("MessageSignature");
             let time = new Date().getTime().toString().slice(0,-3);
             let respObj = {};
             if (walletAddress in BlockchainData.validationBlocks)
             {
               //validate signature
                let validateBlock = BlockchainData.validationBlocks[walletAddress];
                let message = validateBlock.message;
                let isVerified = bitcoinMessage.verify(message,walletAddress,signature);
                if(isVerified)
                {
                    BlockchainData.validatedRequest.push(walletAddress);
                     //now send the response
                     //let respObj = {};
                     respObj.registerStar = "true";
                     let status = 
                        {address: validateBlock.userId,
                         requestTimeStamp: validateBlock.timeStamp,
                         message: validateBlock.userId + ":" + validateBlock.timeStamp + ":starRegistry",
                         validationWindow: 300000 - (time - validateBlock.timeStamp),
                         messageSignature: "valid"
                        }
                     respObj.status = status;
                }
                else{
                    //let respObj = {};
                     respObj.registerStar = "false";
                     let status = 
                        {address: validateBlock.userId,
                         requestTimeStamp: validateBlock.timeStamp,
                         message: validateBlock.userId + ":" + validateBlock.timeStamp + ":starRegistry",
                         validationWindow: 300000 - (time - validateBlock.timeStamp),
                         messageSignature: "invalid"
                        }
                     respObj.status = status;

                    }
                 
                
             }
             else{
                // need to try again as the validation window may have expired
                
                    respObj.message = "Record not found. Please try the validateRequest again from the beginning";                    
                     
                 }
            
             return res.ok(respObj);
               
            }                 
        catch(error)
          {
           return res.serverError(error);
          }  
       },

};

