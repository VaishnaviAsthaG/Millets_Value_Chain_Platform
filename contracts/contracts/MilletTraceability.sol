// SPDX-License-Identifier: _MIT_
pragma solidity ^0.8.20;

contract MilletTraceability {
    struct Batch {
        string batchId;
        string ipfsCID;
        address farmer;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => Batch) public batches;
    mapping(address => string[]) public farmerBatches;
    
    address public owner;
    uint256 public batchCounter;
    
    event BatchRegistered(
        string indexed batchId,
        string ipfsCID,
        address indexed farmer,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        batchCounter = 0;
    }

    function registerBatch(
        string memory _batchId,
        string memory _ipfsCID,
        address _farmer
    ) public onlyOwner {
        require(!batches[_batchId].exists, "Batch ID already exists");
        
        batches[_batchId] = Batch({
            batchId: _batchId,
            ipfsCID: _ipfsCID,
            farmer: _farmer,
            timestamp: block.timestamp,
            exists: true
        });
        
        farmerBatches[_farmer].push(_batchId);
        batchCounter++;
        
        emit BatchRegistered(_batchId, _ipfsCID, _farmer, block.timestamp);
    }

    function getBatch(string memory _batchId) public view returns (
        string memory batchId,
        string memory ipfsCID,
        address farmer,
        uint256 timestamp,
        bool exists
    ) {
        Batch memory batch = batches[_batchId];
        return (
            batch.batchId,
            batch.ipfsCID,
            batch.farmer,
            batch.timestamp,
            batch.exists
        );
    }

    function getFarmerBatches(address _farmer) public view returns (string[] memory) {
        return farmerBatches[_farmer];
    }

    function batchExists(string memory _batchId) public view returns (bool) {
        return batches[_batchId].exists;
    }
}


