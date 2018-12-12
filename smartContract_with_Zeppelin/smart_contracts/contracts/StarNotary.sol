pragma solidity ^0.4.23;
//pragma experimental ABIEncoderV2;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721.sol';

contract StarNotary is ERC721 { 
    /* struct Coordinators{
        string dec;
        string mag;
        string cent;
    } */
    struct Star { 
        string name;        
        string dec;
        string mag;
        string cent;
        string story;
        
    }
    

    mapping(uint256 => Star) public tokenIdToStarInfo; 
    mapping(uint256 => uint256) public starsForSale;
    mapping(uint => uint256)  public CoordinatesToTokenId;
    uint[] starsSale;
    mapping(uint=>uint) indexOfstarsSale;


    function createStar(string _name,string _dec, string _mag,string _cent,string _story, uint256 _tokenId) public { 
        bytes memory _ba = bytes(tokenIdToStarInfo[_tokenId].name);
        require(checkIfStarExists(_dec, _mag, _cent) == false, "ERROR: The star with these coordinates exists");
        
        require(_ba.length == 0, "ERROR: This tokenId already exists");
        Star memory newStar = Star(_name,_dec, _mag, _cent,_story);
        uint dec = uint(keccak256(_dec));
        uint mag = uint(keccak256(_mag));
        uint cent = uint(keccak256(_cent));
        uint _coordsstar= dec + mag + cent;
        
        tokenIdToStarInfo[_tokenId] = newStar;
        CoordinatesToTokenId[_coordsstar] = _tokenId;
        

       // ERC721Token.mint(_tokenId);
       // Star memory newStar = Star(_name);

       // tokenIdToStarInfo[_tokenId] = newStar;

        _mint(msg.sender, _tokenId);
    }

    
        function StarsForSale() public view returns(uint[]) {
        
        
        return starsSale;
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public { 
        require(this.ownerOf(_tokenId) == msg.sender);
        starsSale.push(_tokenId);
        indexOfstarsSale[_tokenId]=starsSale.length -1;
        starsForSale[_tokenId] = _price;
    }

   

    function removeStarFromArray(uint _tokenId) {
        uint index = indexOfstarsSale[_tokenId];
        

        if (starsSale.length > 1) {
        starsSale[index] = starsSale[starsSale.length-1];
        delete(starsSale[starsSale.length-1]); // recover gas
        }
        starsSale.length--;
    }

    function buyStar(uint256 _tokenId) public payable { 
        require(starsForSale[_tokenId] > 0);
        
        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);
        
        starOwner.transfer(starCost);

        if(msg.value > starCost) { 
            msg.sender.transfer(msg.value - starCost);
        }
        removeStarFromArray(_tokenId);
    }

    function checkIfStarExists(string _dec,string _mag,string _cent) public view returns(bool) {
        uint dec = uint(keccak256(_dec));
        uint mag = uint(keccak256(_mag));
        uint cent = uint(keccak256(_cent));
        uint _coordsstar = dec + mag + cent;
        
        return (CoordinatesToTokenId[_coordsstar] > 0);
    }

    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string name, string story, string cent, string dec, string mag){
        bytes memory _ba = bytes(tokenIdToStarInfo[_tokenId].name);
        require(_ba.length > 0, "ERROR: This token does not exists");
        Star memory _star =  tokenIdToStarInfo[_tokenId];        
         //  ["Star power 103!", "I love my wonderful star", "ra_032.155", "dec_121.874", "mag_245.978"]
         string memory _mag = strConcat("mag_",_star.mag);
         string memory _dec = strConcat("dec_",_star.dec);
         string memory _cent = strConcat("ra_",_star.cent);
         
        return (_star.name,_star.story,_cent,_dec,_mag);
       
        
        
    }
    //https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol
     function strConcat(string _a, string _b) internal pure returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);        
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];        
        return string(bab);
    }
}