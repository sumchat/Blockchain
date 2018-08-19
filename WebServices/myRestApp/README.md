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
+   Use the command Sails lift in Node.js command prompt to launch the application at http://localhost:8000
+   A folder chainDB will be created under Project-3 folder. It will be used to store the levelDB database.

##  External Libraries used
The application uses Leveldb as database to store the blocks and crypto-js to generate the hash for the block.

##  Security - Configuration for Sails' built-in CSRF protection middleware
The csrf setting in security.js file need to be set to True to enable CSRF(Cross-Site-Request-Forgery) protection. If set to true 
then the X-CSRF-TOKEN needs to be included in the header with every POST request. The value of the X-CSRF-Token can be obtained by making another 
GET request at http://localhost:8000/csrfToken

##  API Endpoints

a) GET /block/:id: http://localhost:8000/block/{BLOCK_HEIGHT}

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

b) POST /block: http://localhost:8000/block

   Post a new block with "data" payload option to add data to the block body. 
    *   The block body  supports a string of text.
    *   The response for the endpoint  provides block object in JSON format e.g.
    {
    "data": "this is with csrf",
    "height": 19,
    "time": "1534645850",
    "previousBlockHash": "f699e03995359ab3bbc0a502c0c82be7424aa7c472daf49b2fdb0c325c2bb6c5",
    "hash": "d789ac3cecf5ce02f0e6d77bde9096a1521d5f592cec2cb2d2b8c825706f8038"
    }