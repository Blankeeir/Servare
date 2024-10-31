// abi/ServareMarketplace.abi.ts
export const ServareMarketplaceAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_nftContract",
          type: "address"
        },
        {
          internalType: "address",
          name: "_vetToken",
          type: "address"
        },
        {
          internalType: "address",
          name: "_feeCollector",
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
          indexed: true,
          internalType: "address",
          name: "winner",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "AuctionFinalized",
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
          name: "bidder",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "BidPlaced",
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
          name: "seller",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256"
        },
        {
          indexed: false,
          internalType: "enum ServareMarketplace.ListingType",
          name: "listingType",
          type: "uint8"
        }
      ],
      name: "Listed",
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
          name: "seller",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "buyer",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256"
        }
      ],
      name: "Sale",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "buyItem",
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
      name: "cancelListing",
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
      name: "finalizeAuction",
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
      name: "getListing",
      outputs: [
        {
          internalType: "address",
          name: "seller",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256"
        },
        {
          internalType: "bool",
          name: "isActive",
          type: "bool"
        },
        {
          internalType: "uint256",
          name: "listedAt",
          type: "uint256"
        },
        {
          internalType: "enum ServareMarketplace.ListingType",
          name: "listingType",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "auctionEndTime",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "highestBidder",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "highestBid",
          type: "uint256"
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
          name: "price",
          type: "uint256"
        },
        {
          internalType: "enum ServareMarketplace.ListingType",
          name: "listingType",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "auctionDuration",
          type: "uint256"
        }
      ],
      name: "listItem",
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
          name: "amount",
          type: "uint256"
        }
      ],
      name: "placeBid",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ];
  