// abi/SupplyChainTracking.abi.ts
export const SupplyChainTrackingAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_nftContract",
          type: "address"
        }
      ],
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
          indexed: false,
          internalType: "string",
          name: "alertType",
          type: "string"
        },
        {
          indexed: false,
          internalType: "string",
          name: "description",
          type: "string"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256"
        }
      ],
      name: "AlertTriggered",
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
          name: "location",
          type: "string"
        },
        {
          indexed: false,
          internalType: "string",
          name: "status",
          type: "string"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256"
        }
      ],
      name: "TrackingUpdated",
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
        internalType: "uint256",
        name: "trackingIndex",
        type: "uint256"
        },
        {
        indexed: true,
        internalType: "address",
        name: "validator",
        type: "address"
        },
        {
        indexed: false,
        internalType: "bool",
        name: "isValid",
        type: "bool"
        }
    ],
    name: "TrackingValidated",
    type: "event"
    },
    {
    inputs: [
        {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
        },
        {
        internalType: "string",
        name: "location",
        type: "string"
        },
        {
        internalType: "string",
        name: "handler",
        type: "string"
        },
        {
        internalType: "string",
        name: "status",
        type: "string"
        },
        {
        internalType: "string[]",
        name: "envKeys",
        type: "string[]"
        },
        {
        internalType: "string[]",
        name: "envValues",
        type: "string[]"
        },
        {
        internalType: "uint256",
        name: "temperature",
        type: "uint256"
        },
        {
        internalType: "uint256",
        name: "humidity",
        type: "uint256"
        }
    ],
    name: "addTrackingData",
    outputs: [],
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
    name: "getTrackingHistory",
    outputs: [
        {
        components: [
            {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256"
            },
            {
            internalType: "string",
            name: "location",
            type: "string"
            },
            {
            internalType: "string",
            name: "handler",
            type: "string"
            },
            {
            internalType: "string",
            name: "status",
            type: "string"
            },
            {
            internalType: "string[]",
            name: "envKeys",
            type: "string[]"
            },
            {
            internalType: "string[]",
            name: "envValues",
            type: "string[]"
            },
            {
            internalType: "uint256",
            name: "temperature",
            type: "uint256"
            },
            {
            internalType: "uint256",
            name: "humidity",
            type: "uint256"
            },
            {
            internalType: "bool",
            name: "isValidated",
            type: "bool"
            },
            {
            internalType: "address",
            name: "validator",
            type: "address"
            }
        ],
        internalType: "struct ISupplyChainTracking.TrackingData[]",
        name: "",
        type: "tuple[]"
        }
    ],
    stateMutability: "view",
    type: "function"
    },
    {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
    },
    {
    inputs: [
        {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
        },
        {
        internalType: "uint256",
        name: "maxTemperature",
        type: "uint256"
        },
        {
        internalType: "uint256",
        name: "minTemperature",
        type: "uint256"
        },
        {
        internalType: "uint256",
        name: "maxHumidity",
        type: "uint256"
        },
        {
        internalType: "uint256",
        name: "minHumidity",
        type: "uint256"
        }
    ],
    name: "setThresholds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
    },
    {
    inputs: [
        {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4"
        }
    ],
    name: "supportsInterface",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
        },
        {
        internalType: "uint256",
        name: "trackingIndex",
        type: "uint256"
        },
        {
        internalType: "bool",
        name: "isValid",
        type: "bool"
        },
        {
        internalType: "string",
        name: "notes",
        type: "string"
        }
    ],
    name: "validateTrackingData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
    },
    {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
    }
];