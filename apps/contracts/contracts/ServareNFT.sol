// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Food Product NFT Contract
contract SurfoodNFT is ERC721, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct FoodProduct {
        string name;
        string description;
        uint256 quantity;
        string location;
        uint256 expiryDate;
        string productionDate;
        string category;
        string imageURI;
        uint256 price;
        bool isListed;
        address producer;
        bool isVerified;
        mapping(uint256 => SupplyChainEvent) supplyChainEvents;
        uint256 eventCount;
        bytes32 ipfsMetadataHash;
        ProductQuality quality;
        uint256 carbonFootprint;
    }

    struct SupplyChainEvent {
        uint256 timestamp;
        string eventType;
        string location;
        string handlerName;
        bytes32 ipfsDataHash;
        mapping(string => string) sensorData;
    }

    enum ProductQuality { Excellent, Good, Fair, Poor }

    mapping(uint256 => FoodProduct) public foodProducts;
    mapping(address => bool) public verifiedProducers;
    
    event ProductCreated(uint256 indexed tokenId, address producer);
    event SupplyChainEventAdded(uint256 indexed tokenId, string eventType);
    event QualityUpdated(uint256 indexed tokenId, ProductQuality quality);

    constructor() ERC721("Surfood", "FOOD") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createFoodProduct(
        string memory name,
        string memory description,
        uint256 quantity,
        string memory location,
        uint256 expiryDate,
        string memory productionDate,
        string memory category,
        string memory imageURI,
        uint256 price,
        bytes32 ipfsMetadataHash
    ) public returns (uint256) {
        require(hasRole(PRODUCER_ROLE, msg.sender), "Must have producer role");
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        FoodProduct storage newProduct = foodProducts[newItemId];
        newProduct.name = name;
        newProduct.description = description;
        newProduct.quantity = quantity;
        newProduct.location = location;
        newProduct.expiryDate = expiryDate;
        newProduct.productionDate = productionDate;
        newProduct.category = category;
        newProduct.imageURI = imageURI;
        newProduct.price = price;
        newProduct.isListed = true;
        newProduct.producer = msg.sender;
        newProduct.ipfsMetadataHash = ipfsMetadataHash;
        newProduct.quality = ProductQuality.Good;
        
        emit ProductCreated(newItemId, msg.sender);
        return newItemId;
    }

    function addSupplyChainEvent(
        uint256 tokenId,
        string memory eventType,
        string memory location,
        string memory handlerName,
        bytes32 ipfsDataHash,
        string[] memory sensorKeys,
        string[] memory sensorValues
    ) public {
        require(_exists(tokenId), "Token does not exist");
        require(hasRole(VERIFIER_ROLE, msg.sender), "Must have verifier role");
        
        FoodProduct storage product = foodProducts[tokenId];
        uint256 eventId = product.eventCount;
        
        SupplyChainEvent storage newEvent = product.supplyChainEvents[eventId];
        newEvent.timestamp = block.timestamp;
        newEvent.eventType = eventType;
        newEvent.location = location;
        newEvent.handlerName = handlerName;
        newEvent.ipfsDataHash = ipfsDataHash;
        
        for(uint i = 0; i < sensorKeys.length; i++) {
            newEvent.sensorData[sensorKeys[i]] = sensorValues[i];
        }
        
        product.eventCount++;
        emit SupplyChainEventAdded(tokenId, eventType);
    }

    function updateQuality(uint256 tokenId, ProductQuality quality) public {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Must have verifier role");
        foodProducts[tokenId].quality = quality;
        emit QualityUpdated(tokenId, quality);
    }
}
