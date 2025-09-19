// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DAOGovernance is AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
    bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");

    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        bool cancelled;
        mapping(address => bool) hasVoted;
    }

    struct CommunityMember {
        address member;
        string name;
        string region;
        uint256 stake;
        bool active;
        uint256 joinedAt;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => CommunityMember) public members;
    mapping(address => uint256) public memberStakes;
    
    uint256 public nextProposalId;
    uint256 public totalStake;
    uint256 public votingPeriod = 7 days;
    uint256 public minimumStake = 1000 * 10**18; // 1000 tokens minimum stake
    
    IERC20 public governanceToken;
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event MemberAdded(address indexed member, string name, string region);
    event StakeUpdated(address indexed member, uint256 newStake);

    constructor(address _governanceToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        governanceToken = IERC20(_governanceToken);
    }

    function createProposal(
        string memory title,
        string memory description
    ) external onlyRole(MEMBER_ROLE) whenNotPaused returns (uint256) {
        require(memberStakes[msg.sender] >= minimumStake, "Insufficient stake");
        
        uint256 proposalId = nextProposalId++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        proposal.executed = false;
        proposal.cancelled = false;
        
        emit ProposalCreated(proposalId, msg.sender, title);
        return proposalId;
    }

    function vote(uint256 proposalId, bool support) external onlyRole(VOTER_ROLE) whenNotPaused {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal executed");
        require(!proposal.cancelled, "Proposal cancelled");
        
        uint256 weight = memberStakes[msg.sender];
        require(weight > 0, "No stake");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external whenNotPaused nonReentrant {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(!proposal.cancelled, "Proposal cancelled");
        require(proposal.forVotes > proposal.againstVotes, "Proposal rejected");
        
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
        
        // Execute proposal logic here
        _executeProposal(proposalId);
    }

    function addMember(
        address member,
        string memory name,
        string memory region
    ) external onlyRole(ADMIN_ROLE) {
        require(!members[member].active, "Member exists");
        
        members[member] = CommunityMember({
            member: member,
            name: name,
            region: region,
            stake: 0,
            active: true,
            joinedAt: block.timestamp
        });
        
        _grantRole(MEMBER_ROLE, member);
        _grantRole(VOTER_ROLE, member);
        
        emit MemberAdded(member, name, region);
    }

    function updateStake(address member, uint256 newStake) external onlyRole(ADMIN_ROLE) {
        require(members[member].active, "Member not active");
        
        uint256 oldStake = memberStakes[member];
        memberStakes[member] = newStake;
        totalStake = totalStake - oldStake + newStake;
        
        members[member].stake = newStake;
        
        emit StakeUpdated(member, newStake);
    }

    function _executeProposal(uint256 proposalId) internal {
        // Implementation for specific proposal execution
        // This would contain logic for different types of proposals
        // such as parameter updates, fund allocation, etc.
    }

    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 startTime,
        uint256 endTime,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        bool cancelled
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed,
            proposal.cancelled
        );
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
