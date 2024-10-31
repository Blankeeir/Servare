// abi/ServareNFT.abi.ts
export const ServareNFTAbi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: true,
          internalType: "address",
          name: "producer",
          type: "address"
        },
        {
          indexed: false,
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256"
        }
      ],
      name: "ProductCreated",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: true,
          internalType: "address",
          name: "verifier",
          type: "address"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isVerified",
          type: "bool"
        }
      ],
      name: "ProductVerified",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "string",
          name: "eventType",
          type: "string"
        },
        {
          indexed: false,
          internalType: "string",
          name: "location",
          type: "string"
        }
      ],
      name: "SupplyChainEventAdded",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        }
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32"
        },
        {
          internalType: "address",
          name: "account",
          type: "address"
        }
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "location",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "expiryDate",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "productionDate",
          type: "string"
        },
        {
          internalType: "string",
          name: "category",
          type: "string"
        },
        {
          internalType: "string",
          name: "imageUri",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256"
        },
        {
          internalType: "bytes32",
          name: "metadataHash",
          type: "bytes32"
        },
        {
          internalType: "uint256",
          name: "carbonFootprint",
          type: "uint256"
        }
      ],
      name: "createProduct",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "getProduct",
      outputs: [
        {
          internalType: "string",
          name: "name",
          type: "string"
        },
        {
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "location",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "expiryDate",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "productionDate",
          type: "string"
        },
        {
          internalType: "string",
          name: "category",
          type: "string"
        },
        {
          internalType: "string",
          name: "imageUri",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "isListed",
          type: "bool"
        },
        {
          internalType: "address",
          name: "producer",
          type: "address"
        },
        {
          internalType: "bool",
          name: "isVerified",
          type: "bool"
        },
        {
          internalType: "uint256",
          name: "carbonFootprint",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "qualityScore",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ];