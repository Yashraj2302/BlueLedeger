// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Retirement721 is ERC721, AccessControl, Pausable {
    using Counters for Counters.Counter;

    bytes32 public constant REGISTRY_ROLE = keccak256("REGISTRY_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct RetirementCertificate {
        bytes32 projectId;
        uint256 vintage;
        uint256 amountRetired;
        uint256 tokenId;
        bytes32 burnTx;
        string evidenceCID;
        uint256 retiredAt;
        address retirer;
    }

    Counters.Counter private _tokenIdCounter;
    
    mapping(uint256 => RetirementCertificate) public certificates;
    mapping(bytes32 => uint256) public burnTxToCertificate;
    
    string public baseURI;
    string public contractURI;

    event CertificateIssued(
        uint256 indexed certificateId,
        address indexed retirer,
        bytes32 indexed projectId,
        uint256 vintage,
        uint256 amountRetired,
        bytes32 burnTx
    );

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        string memory _contractURI
    ) ERC721(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRY_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        baseURI = _baseURI;
        contractURI = _contractURI;
    }

    function issueCertificate(
        address retirer,
        bytes32 projectId,
        uint256 vintage,
        uint256 amountRetired,
        uint256 originalTokenId,
        bytes32 burnTx,
        string memory evidenceCID
    ) external onlyRole(REGISTRY_ROLE) whenNotPaused returns (uint256) {
        require(burnTxToCertificate[burnTx] == 0, "Certificate already exists for burn tx");
        
        uint256 certificateId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        certificates[certificateId] = RetirementCertificate({
            projectId: projectId,
            vintage: vintage,
            amountRetired: amountRetired,
            tokenId: originalTokenId,
            burnTx: burnTx,
            evidenceCID: evidenceCID,
            retiredAt: block.timestamp,
            retirer: retirer
        });
        
        burnTxToCertificate[burnTx] = certificateId;
        
        _safeMint(retirer, certificateId);
        
        emit CertificateIssued(certificateId, retirer, projectId, vintage, amountRetired, burnTx);
        
        return certificateId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token not found");
        
        return string(abi.encodePacked(
            baseURI,
            "/certificate/",
            Strings.toString(tokenId),
            ".json"
        ));
    }

    function getCertificate(uint256 tokenId) external view returns (RetirementCertificate memory) {
        require(_exists(tokenId), "Token not found");
        return certificates[tokenId];
    }

    function getCertificateByBurnTx(bytes32 burnTx) external view returns (uint256) {
        return burnTxToCertificate[burnTx];
    }

    function setBaseURI(string memory newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = newBaseURI;
    }

    function setContractURI(string memory newContractURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        contractURI = newContractURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
