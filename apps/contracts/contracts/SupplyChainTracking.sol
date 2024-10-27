// Supply Chain Tracking Contract
contract SupplyChainTracking is AccessControl {
    bytes32 public constant TRACKER_ROLE = keccak256("TRACKER_ROLE");
    
    struct TrackingData {
        uint256 timestamp;
        string location;
        string handler;
        string status;
        mapping(string => string) environmentalData;
    }
    
    mapping(uint256 => TrackingData[]) public productTracking;
    
    event TrackingUpdated(
        uint256 indexed tokenId,
        string location,
        string status,
        uint256 timestamp
    );
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function addTrackingData(
        uint256 tokenId,
        string memory location,
        string memory handler,
        string memory status,
        string[] memory envKeys,
        string[] memory envValues
    ) public {
        require(hasRole(TRACKER_ROLE, msg.sender), "Must have tracker role");
        
        uint256 index = productTracking[tokenId].length;
        TrackingData storage newData = productTracking[tokenId].push();
        newData.timestamp = block.timestamp;
        newData.location = location;
        newData.handler = handler;
        newData.status = status;
        
        for(uint i = 0; i < envKeys.length; i++) {
            newData.environmentalData[envKeys[i]] = envValues[i];
        }
        
        emit TrackingUpdated(tokenId, location, status, block.timestamp);
    }
}