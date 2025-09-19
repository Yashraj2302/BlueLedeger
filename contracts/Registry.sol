// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract Registry is AccessControl, Pausable, ReentrancyGuard, EIP712 {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct Project {
        address owner;
        string geoCID;
        bytes32 footprintHash;
        uint256 methodologyId;
        bool active;
        uint256 createdAt;
    }

    struct MRVAttestation {
        bytes32 projectId;
        uint256 vintage;
        uint256 tCO2e;
        string evidenceCID;
        address oracle;
        bytes signature;
        uint256 schemaVersion;
        uint256 timestamp;
    }

    struct Evidence {
        bytes32 projectId;
        uint256 vintage;
        string evidenceCID;
        bytes32 attestationId;
    }

    mapping(bytes32 => Project) public projects;
    mapping(bytes32 => MRVAttestation) public attestations;
    mapping(uint256 => Evidence) public evidences;
    
    uint256 public nextAttestationId;
    uint256 public nextEvidenceId;
    
    // Schema versioning
    mapping(uint256 => bool) public allowedSchemaVersions;
    uint256 public currentSchemaVersion = 1;

    event ProjectCreated(
        bytes32 indexed projectId,
        address indexed owner,
        string geoCID,
        bytes32 footprintHash,
        uint256 methodologyId
    );

    event MRVAttested(
        bytes32 indexed attestationId,
        bytes32 indexed projectId,
        uint256 vintage,
        uint256 tCO2e,
        string evidenceCID,
        address oracle
    );

    event MintAuthorized(
        uint256 indexed tokenId,
        bytes32 indexed projectId,
        uint256 amount,
        string evidenceCID,
        bytes32 attestationId
    );

    constructor() EIP712("BlueLedger", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        allowedSchemaVersions[1] = true;
    }

    function createProject(
        string memory geoCID,
        bytes32 footprintHash,
        uint256 methodologyId
    ) external whenNotPaused returns (bytes32 projectId) {
        projectId = keccak256(abi.encodePacked(
            footprintHash,
            msg.sender,
            block.timestamp
        ));
        
        require(projects[projectId].owner == address(0), "Project exists");
        
        projects[projectId] = Project({
            owner: msg.sender,
            geoCID: geoCID,
            footprintHash: footprintHash,
            methodologyId: methodologyId,
            active: true,
            createdAt: block.timestamp
        });

        emit ProjectCreated(projectId, msg.sender, geoCID, footprintHash, methodologyId);
    }

    function attestMRV(
        bytes32 projectId,
        uint256 vintage,
        uint256 tCO2e,
        string memory evidenceCID,
        bytes memory signature
    ) external onlyRole(ORACLE_ROLE) whenNotPaused {
        require(projects[projectId].active, "Project not active");
        
        bytes32 attestationId = keccak256(abi.encodePacked(
            projectId,
            vintage,
            evidenceCID,
            block.timestamp
        ));
        
        attestations[attestationId] = MRVAttestation({
            projectId: projectId,
            vintage: vintage,
            tCO2e: tCO2e,
            evidenceCID: evidenceCID,
            oracle: msg.sender,
            signature: signature,
            schemaVersion: currentSchemaVersion,
            timestamp: block.timestamp
        });

        emit MRVAttested(attestationId, projectId, vintage, tCO2e, evidenceCID, msg.sender);
    }

    function authorizeMint(
        bytes32 projectId,
        uint256 vintage,
        uint256 amount,
        string memory evidenceCID,
        bytes32 attestationId
    ) external onlyRole(VERIFIER_ROLE) whenNotPaused {
        require(attestations[attestationId].projectId == projectId, "Invalid attestation");
        
        uint256 tokenId = uint256(keccak256(abi.encodePacked(
            projectId,
            vintage,
            projects[projectId].methodologyId
        )));
        
        evidences[nextEvidenceId] = Evidence({
            projectId: projectId,
            vintage: vintage,
            evidenceCID: evidenceCID,
            attestationId: attestationId
        });

        emit MintAuthorized(tokenId, projectId, amount, evidenceCID, attestationId);
        nextEvidenceId++;
    }

    function updateSchemaVersion(uint256 newVersion) external onlyRole(ADMIN_ROLE) {
        allowedSchemaVersions[newVersion] = true;
        currentSchemaVersion = newVersion;
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
