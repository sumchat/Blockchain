# my-rest-app

a [Sails v1](https://sailsjs.com) application


### Links

+ [Get started](https://sailsjs.com/get-started)
+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Thu Aug 16 2018 20:34:56 GMT-0400 (Eastern Daylight Time) using Sails v1.0.2.

<!-- Internally, Sails used [`sails-generate@1.15.28`](https://github.com/balderdashy/sails-generate/tree/v1.15.28/lib/core-generators/new). -->


This project's boilerplate is based on an expanded seed app provided by the [Sails core team](https://sailsjs.com/about) to make it easier for you to build on top of ready-made features like authentication, enrollment, email verification, and billing.  For more information, [drop us a line](https://sailsjs.com/support).


<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

##   Environment Requirements
+   Node version used: 10.7.0
+   Npm version: 6.2.0
+   Node JS Framework used: Sails

##  Install instructions

+   Download or clone the repository Blockchain.
+   cd to the WebServices\myRestApp
+   Install the requirements from the included package.json file using: npm install
+   Use the command Sails lift or node app.js 
+    in Node.js command prompt to launch the application at http://localhost:8000
+   A folder chainDB will be created under Project-3 folder. It will be used to store the levelDB database.

##  External Libraries used
The application uses Leveldb as database to store the blocks and crypto-js to generate the hash for the block.

##  Security - Configuration for Sails' built-in CSRF protection middleware
The csrf setting in security.js file need to be set to True to enable CSRF(Cross-Site-Request-Forgery) protection. If set to true 
then the X-CSRF-TOKEN needs to be included in the header with every POST request. The value of the X-CSRF-Token can be obtained by making another 
GET request at http://localhost:8000/csrfToken

##  API Endpoints

a) Configure Blockchain ID validation routine. This routine will     allow users to request ownership of a star and validate their     request to grant ownership of a star.The Web API will allow       users to submit their request using their wallet address.The      web API will accept a Blockchain ID (The Blockchain ID is your    wallet address) with a request for star registration.
   The users Blockchain ID will be stored with a timestamp.
   This timestamp is used to time wall the user request for star registration.After submitting a request, the user will receive a response in JSON format with a message to sign.
   In the event the time expires, the address is removed from the validation routine forcing the user to restart the process.
   URL
   This functionality is made available at the following URL.      


   http://localhost:8000/requestValidation

   ![requestValidation](https://github.com/sumchat/Blockchain/blob/WebServices/WebServices/myRestApp/img/requestValidation1.jpg)

    

b) After receiving the response, users will prove their blockchain identity by signing a message with their wallet. Once they sign this message, the application will validate        their request and grant access to register a star.

  ![signature](https://github.com/sumchat/Blockchain/blob/WebServices/WebServices/myRestApp/img/signature.jpg)

   URL
   This functionality is provided at the following URL.

   http://localhost:8000/message-signature/validate

   Payload
   The payload delivered by the user requires the following fields.

   Wallet address
   Message signature

   ![signatureValidation](https://github.com/sumchat/Blockchain/blob/WebServices/WebServices/myRestApp/img/signatureValidate.jpg)

c) POST /block: http://localhost:8000/block

 ![signatureValidation](https://github.com/sumchat/Blockchain/blob/WebServices/WebServices/myRestApp/img/signatureValidate.jpg)

   Post a new block with following  payload  to add  to the block body. 
    *  
    *   The response for the endpoint  provides block object in JSON format e.g.   
    
    Wallet address (blockchain identity), star object with the following properties.
    Requires address [Wallet address]
    Requires star object with properties
    right_ascension
    declination
    magnitude [optional]
    constellation [optional]
    star_story [Hex encoded Ascii string limited to 250 words/500 bytes]

 ![post](https://github.com/sumchat/Blockchain/blob/WebServices/WebServices/myRestApp/img/block_post.jpg)

 ![header](https://github.com/sumchat/Blockchain/blob/WebServices/WebServices/myRestApp/img/block_post_header.jpg)
  
 

d) Configure Star Lookup

    i) GET /block/:id: http://localhost:8000/block/{BLOCK_HEIGHT}

   GET request using URL path with a block height parameter.
    *   URL path should resemble: http://localhost:8000/block/0
    *   '0' within the URL path is the block height. 
    *   The response for the endpoint will provide block object in JSON format.
    e.g Example: Block Height 0 -> http://localhost:8000/block/0
    Response Output:
    {
    "hash": "1427f14c3399651c2da024aa9b07311d2c6f45702b2910b4dc699f245c5d0f13",
    "height": 0,
    "data": "First block in the chain - Genesis block",
    "time": "1534608564",
    "previousBlockHash": ""
    }

    ii)GET by Blockchain Wallet Address

     http://localhost:8000/stars/address:[ADDRESS]

    iii) GET by Star Block Hash
    
     http://localhost:8000/stars/hash:[HASH]
     e.g
     http://localhost:8000/stars/hash:d24bb3d6951c61850d554737886971ddb77d71a4ecdfcd7b89a8a2c9df76a5c8

     response -
     [
        {
        "body": {
            "address": "1CBYPiW5xfKuKofayXFVU9eKWFrtJZGX5s",
            "star": {
                "declination": "-26° 29' 24.9",
                "right_ascension": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
            }
        },
        "height": 1,
        "time": "1536801780",
        "previousBlockHash": "f0793a915f27b7c3ef999adc1c77918deebb3b625dc88c30b0766b131bafad24",
        "hash": "d24bb3d6951c61850d554737886971ddb77d71a4ecdfcd7b89a8a2c9df76a5c8"
        }
    ]



    