//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";


/**
 * @title World Promotion Platform DApp
 * @author Dhananjay & Shivali @ EthNYC June, 2022 
 **/

contract WPP is AccessControl, KeeperCompatibleInterface {
    uint public promotionId;
    address public owner;
    address [] public awaitingUpkeep;
    
    enum PromotionState {invalid, setup, live, ended}

    struct PromotionCreator {
        address tokenAddress;
        address uploader;
        uint totalNumOftokens;
        uint  NumOftokensPerTrng;
        string cid;
        uint promotionId;
        bool isActive;
        PromotionState state;
    }
            
    mapping(address => PromotionCreator) public promotions;
    mapping(address => mapping(address => bool)) userCompletedTraining; 
    //mapping(address => mapping(uint => bool)) userCompletedTraining; 
    mapping(address => mapping(address => bool)) payoutForTraining;

    event NewPromotionCreated(address indexed TokenAddress, uint PromotionId, uint NumOftokensPerTrng, string IPFSCID);
    event PromotionStarted(address indexed TokenAddress, uint PromotionId, uint TokenBalance);
    event AccessGranted(address indexed User, uint PromotionId);
    event ClaimProcessed(address User, address TokenAddress, uint amount , uint ContractBalance);

    constructor(address _owner) {
              owner = _owner; 
              _setupRole(DEFAULT_ADMIN_ROLE, _owner);
              _setupRole(bytes32("USER_ROLE"), _owner); 
    }

/**
  @notice This function is called from script after the promotion material has been uploaded on IPFS
  @dev Add the token related information in all the mappings * 
  @param _tokenAddress address
  @param _totalNumOftokens uint
  @param _NumOftokensPerTrng uint
  @param _cid string
 **/
    function createPromotion(         
        address _tokenAddress, 
        uint _totalNumOftokens,
        uint  _NumOftokensPerTrng,
        string calldata _cid) 
        external 
        {
        require(_totalNumOftokens > 0, "Promotion cannot be created with 0 tokens");
        require(_NumOftokensPerTrng > 0, "Promotion cannot be created with 0 give-away tokens per training");
        ERC20 token = ERC20(_tokenAddress);        
        require(token.totalSupply() > 0, "Token does not have enough supply");
        console.log(token.totalSupply());
        console.log(token.name());

        ++promotionId;
        PromotionCreator storage promotion = promotions[_tokenAddress];
        promotion.tokenAddress = _tokenAddress;
        promotion.uploader = msg.sender;
        promotion.totalNumOftokens=_totalNumOftokens;
        promotion.NumOftokensPerTrng=_NumOftokensPerTrng;
        promotion.cid=_cid;
        promotion.promotionId=promotionId;
        promotion.state = PromotionState.setup;                 
        awaitingUpkeep.push(_tokenAddress);        
        emit NewPromotionCreated(_tokenAddress,  promotionId, _NumOftokensPerTrng, _cid);          
    }

/**
     * @notice Function to get Promotion Information
     * @dev Return the CreatePromotion struct information from promotions mapping
     * @param _tokenAddress address
*/
function getPromotionInfo(address _tokenAddress) public view returns(address addrs, uint totalAmount, uint amtPerTraining, string memory _IPFSCid, uint _promotionId, bool _isActive, PromotionState _state) {
         addrs = promotions[_tokenAddress].tokenAddress;
         totalAmount = promotions[_tokenAddress].totalNumOftokens;
         amtPerTraining= promotions[_tokenAddress].NumOftokensPerTrng;
         _IPFSCid = promotions[_tokenAddress].cid;
         _promotionId= promotions[_tokenAddress].promotionId;
         _isActive = promotions[_tokenAddress].isActive;
         _state=promotions[_tokenAddress].state;
}   


 /**
  @notice This function is called from script after the promotion material has been uploaded onto IPFS & this contract is funded with the Tokens
  @dev Mark isPromotionLive as true
  @param _tokenAddress address
 **/
    function startPromotion(address _tokenAddress) public {
            PromotionCreator storage promotion = promotions[_tokenAddress];
            require(promotion.state== PromotionState.setup, "Promotion is not in setup state");            
            promotion.isActive = true;
            promotion.state = PromotionState.live;            
            emit PromotionStarted(_tokenAddress, promotion.promotionId, IERC20(_tokenAddress).balanceOf(address(this)));
        }

/**
  @notice This function is only called by the owner to assign user role
  @dev Promotion must still be live with enough funds
  @param _user EOA address of the user completing the training
  @param _promotionId promotion id
**/
function markTrainingCompleted(address _user, address _tokenAddress, uint _promotionId) external onlyRole(DEFAULT_ADMIN_ROLE) hasEnoughTokenBalance(_tokenAddress) isPromotionLive(_tokenAddress) {
            userCompletedTraining[_user][_tokenAddress]=true;
            //userCompletedTraining[_user][_tokenAddress]=true;
            grantRole(bytes32("USER_ROLE"), _user);  
            emit AccessGranted(_user, _promotionId);
}

/**
     * @notice Function to get User Completed Training Information
     * @dev Return the information from User Completed Training mapping
     * @param _user address
*/
function getUserCompldTraingInfo(address _user, address _tokenAddress) public view returns(bool) {
    return userCompletedTraining[_user][_tokenAddress];
}

/**
     * @notice This function is called when user has successfully completed the training
     * @dev Ensure user has role assigned and not duplicate claim
     * @param _user user address
     * @param _tokenAddress token address
*/
function submitTokenClaim(address _user,address _tokenAddress, uint _promotionId) external onlyRole(bytes32("USER_ROLE")) hasEnoughTokenBalance(_tokenAddress) isPromotionLive(_tokenAddress) {
    require(userCompletedTraining[_user][_tokenAddress]==true, "You have not completed the training yet!");
    require(payoutForTraining[msg.sender][_tokenAddress]==false, "You already claimed the tokens for this training!");    
            payoutForTraining[msg.sender][_tokenAddress] = true;
            PromotionCreator memory promotion = promotions[_tokenAddress];
            uint amount = promotion.NumOftokensPerTrng; 
            console.log(amount);
            ERC20 token = ERC20(_tokenAddress);
            token.transfer(_user, amount);
            emit ClaimProcessed(_user, _tokenAddress, amount , ERC20(_tokenAddress).balanceOf(address(this)));
}

receive() external payable{

}

function changeOwnership(address _newowner) external onlyRole(DEFAULT_ADMIN_ROLE){
    owner = _newowner;
}

function checkUpkeep(bytes calldata checkData) external view override returns (bool upkeepNeeded, bytes memory performData) {
        
        bool foundToken;        
        for (uint i=0;i<awaitingUpkeep.length;i++){
                address tokenAwaitingtoStart = awaitingUpkeep[i];                                
                PromotionCreator memory promotion = promotions[tokenAwaitingtoStart];
                if(ERC20(tokenAwaitingtoStart).balanceOf(address(this)) >= promotion.totalNumOftokens && promotion.isActive==false){
                   // readyPerformUpkeep.push(tokenAwaitingtoStart);
                    foundToken=true;
                    console.log("foundToken");
                }
        }
        upkeepNeeded=foundToken;
        performData=checkData;
    }

function performUpkeep(bytes calldata) external override {
             for (uint i=0;i<awaitingUpkeep.length;i++){
                 PromotionCreator memory promotion = promotions[awaitingUpkeep[i]];
                if(ERC20(awaitingUpkeep[i]).balanceOf(address(this)) >= promotion.totalNumOftokens && promotion.isActive==false){
                   startPromotion(awaitingUpkeep[i]);                   
                }                    
             }
            //delete readyPerformUpkeep;
    }


    modifier hasTokenBalance(address _tokenAddress) {
        require(ERC20(_tokenAddress).balanceOf(address(this)) >= promotions[_tokenAddress].totalNumOftokens, "Token balance not same as mentioned at the time of create promotion!");
        _;
    }

    modifier hasEnoughTokenBalance(address _tokenAddress) {
        require(ERC20(_tokenAddress).balanceOf(address(this)) >= promotions[_tokenAddress].NumOftokensPerTrng, "Not enough tokens to incentivize!");
        _;
    }

    modifier isPromotionLive(address _tokenAddress) {
        require(promotions[_tokenAddress].isActive == true, "Sorry, promotion has ended!");
        _;
    }

/*
    modifier noDuplicatePromotion(address _tokenAddress){                        // This can be handled on UI by listening to event NewPromotionCreated for Token Address
      if(promotions[_tokenAddress].promotionId > 0 && promotions[_tokenAddress].state != PromotionState.ended) revert("Promotion already exists for this Token!");
      _;
    }
*/ 

}
