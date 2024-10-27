// Marketplace Contract
contract SurfoodMarketplace is ReentrancyGuard, AccessControl {
    using Counters for Counters.Counter;
    
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        uint256 listingDate;
        bool isAuctioned;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
    }

    SurfoodNFT private nftContract;
    IERC20 private vetToken;
    
    mapping(uint256 => MarketItem) public idToMarketItem;
    mapping(uint256 => mapping(address => uint256)) public bids;
    
    event MarketItemCreated(uint256 indexed tokenId, address seller, uint256 price);
    event MarketItemSold(uint256 indexed tokenId, address buyer, uint256 price);
    event AuctionCreated(uint256 indexed tokenId, uint256 startPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 amount);
    
    constructor(address nftAddress, address vetTokenAddress) {
        nftContract = SurfoodNFT(nftAddress);
        vetToken = IERC20(vetTokenAddress);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function createMarketItem(
        uint256 tokenId,
        uint256 price,
        bool isAuction,
        uint256 auctionDuration
    ) public nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not owner");
        
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false,
            block.timestamp,
            isAuction,
            isAuction ? block.timestamp + auctionDuration : 0,
            address(0),
            0
        );
        
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        
        emit MarketItemCreated(tokenId, msg.sender, price);
        if(isAuction) {
            emit AuctionCreated(tokenId, price, block.timestamp + auctionDuration);
        }
    }
    
    function createMarketSale(uint256 tokenId) public nonReentrant {
        MarketItem storage item = idToMarketItem[tokenId];
        require(!item.isAuctioned, "Item is in auction");
        require(vetToken.transferFrom(msg.sender, item.seller, item.price), "Transfer failed");
        
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        item.owner = payable(msg.sender);
        item.sold = true;
        
        emit MarketItemSold(tokenId, msg.sender, item.price);
    }
    
    function placeBid(uint256 tokenId, uint256 amount) public nonReentrant {
        MarketItem storage item = idToMarketItem[tokenId];
        require(item.isAuctioned, "Not an auction");
        require(block.timestamp < item.auctionEndTime, "Auction ended");
        require(amount > item.highestBid, "Bid too low");
        
        if(item.highestBidder != address(0)) {
            // Refund previous bidder
            vetToken.transfer(item.highestBidder, item.highestBid);
        }
        
        require(vetToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        item.highestBidder = msg.sender;
        item.highestBid = amount;
        
        emit BidPlaced(tokenId, msg.sender, amount);
    }
    
    function finalizeAuction(uint256 tokenId) public nonReentrant {
        MarketItem storage item = idToMarketItem[tokenId];
        require(item.isAuctioned, "Not an auction");
        require(block.timestamp >= item.auctionEndTime, "Auction not ended");
        require(!item.sold, "Already finalized");
        
        if(item.highestBidder != address(0)) {
            vetToken.transfer(item.seller, item.highestBid);
            nftContract.transferFrom(address(this), item.highestBidder, tokenId);
            item.owner = payable(item.highestBidder);
            item.sold = true;
            emit MarketItemSold(tokenId, item.highestBidder, item.highestBid);
        } else {
            nftContract.transferFrom(address(this), item.seller, tokenId);
        }
    }
}