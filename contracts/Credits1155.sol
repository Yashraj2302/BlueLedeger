// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Credits1155 is ERC1155, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant REGISTRY_ROLE = keccak256("REGISTRY_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct CreditInfo {
        bytes32 projectId;
        uint256 vintage;
        uint256 methodologyId;
        string evidenceCID;
        bytes32 attestationId;
        uint256 tCO2ePerUnit;
    }

    mapping(uint256 => CreditInfo) public creditInfo;
    mapping(uint256 => bool) public retired;
    
    string public baseURI;
    string public contractURI;

    event BurnedForRetirement(
        address indexed holder,
        uint256 indexed tokenId,
        uint256 amount,
        address indexed retirementContract
    );

    event CreditMinted(
        uint256 indexed tokenId,
        bytes32 indexed projectId,
        uint256 vintage,
        uint256 amount,
        string evidenceCID
    );

    constructor(
        string memory _baseURI,
        string memory _contractURI
    ) ERC1155(_baseURI) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REGISTRY_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        baseURI = _baseURI;
        contractURI = _contractURI;
    }

    function mintAuthorized(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes32 projectId,
        uint256 vintage,
        uint256 methodologyId,
        string memory evidenceCID,
        bytes32 attestationId,
        uint256 tCO2ePerUnit
    ) external onlyRole(REGISTRY_ROLE) whenNotPaused {
        require(!retired[tokenId], "Token retired");
        
        creditInfo[tokenId] = CreditInfo({
            projectId: projectId,
            vintage: vintage,
            methodologyId: methodologyId,
            evidenceCID: evidenceCID,
            attestationId: attestationId,
            tCO2ePerUnit: tCO2ePerUnit
        });

        _mint(to, tokenId, amount, "");
        
        emit CreditMinted(tokenId, projectId, vintage, amount, evidenceCID);
    }

    function burnForRetirement(
        address holder,
        uint256 tokenId,
        uint256 amount
    ) external whenNotPaused nonReentrant {
        require(balanceOf(holder, tokenId) >= amount, "Insufficient balance");
        require(hasRole(REGISTRY_ROLE, msg.sender) || holder == msg.sender, "Not authorized");
        
        _burn(holder, tokenId, amount);
        
        emit BurnedForRetirement(holder, tokenId, amount, msg.sender);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(bytes(creditInfo[tokenId].evidenceCID).length > 0, "Token not found");
        
        return string(abi.encodePacked(
            baseURI,
            "/metadata/",
            Strings.toString(tokenId),
            ".json"
        ));
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
        override(ERC1155, AccessControl)
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
