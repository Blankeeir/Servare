// Now let's create a type file for the ABIs to get better TypeScript support:
// types/contracts.ts

export interface SupplyChainEvent {
    eventType: string;
    location: string;
    temperature: number;
    humidity: number;
    additionalDataHash: string;
    timestamp: number;
  }
  
  export interface Verification {
    verificationType: string;
    isVerified: boolean;
    notes: string;
    timestamp: number;
  }

export interface Product {
    name: string;
    description: string;
    quantity: number;
    location: string;
    expiryDate: number;
    productionDate: string;
    category: string;
    imageUri: string;
    price: number;
    isListed: boolean;
    producer: string;
    isVerified: boolean;
    carbonFootprint: number;
    qualityScore: number;
}
 
export interface TrackingData {
    timestamp: number;
    location: string;
    handler: string;
    status: string;
    envKeys: string[];
    envValues: string[];
    temperature: number;
    humidity: number;
    isValidated: boolean;
    validator: string;
  }
  
  export interface ProductData {
    name: string;
    description: string;
    quantity: number;
    location: string;
    expiryDate: number;
    productionDate: string;
    category: string;
    imageUri: string;
    price: number;
    isListed: boolean;
    producer: string;
    isVerified: boolean;
    carbonFootprint: number;
    qualityScore: number;
  }
  
  export interface Listing {
    seller: string;
    price: number;
    isActive: boolean;
    listedAt: number;
    listingType: number;
    auctionEndTime: number;
    highestBidder: string;
    highestBid: number;
  }
  
  export const enum ListingType {
    FixedPrice = 0,
    Auction = 1
  }