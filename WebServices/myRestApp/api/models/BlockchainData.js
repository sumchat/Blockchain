/* singleton
 *
 * */


var self = module.exports ={
    validationBlocks : {},//stores the initial validate request object
    validatedRequest : [],//stores the wallet address of the verified signature 
    validated : [],// this stores the wallet address of the verified and validated request
    chain : [] 

}