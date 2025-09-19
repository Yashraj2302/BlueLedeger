Smart Contracts Specification

Standards

- ERC-1155: Blue carbon credits (fungible by project-vintage-methodology)
- ERC-721: Retirement certificates (unique per retirement event)
- ERC-2771 (optional): Meta-transactions for better UX

Contracts

1) Registry
- Responsibilities: project records, MRV attestations, authorization of mints, role control
- Roles: ADMIN, VERIFIER, ORACLE
- Key storage:
  - mapping projectId → Project{ owner, geoCID, footprintHash, methodologyId }
  - mapping attestationId → MRVAttestation{ projectId, vintage, tCO2e, evidenceCID, oracle, signature, schemaVersion }
  - mapping tokenId → Evidence{ projectId, vintage, evidenceCID, attestationId }
- Events: ProjectCreated, MRVAttested, MintAuthorized

2) Credits1155 (ERC-1155)
- mintAuthorized(tokenId, amount, evidenceCID, attestationId) onlyRegistry
- burnForRetirement(holder, tokenId, amount) → emits BurnedForRetirement
- uri(tokenId) → IPFS metadata JSON with evidence and attributes
- Events: TransferSingle/Batch, URI, BurnedForRetirement

3) Retirement721 (ERC-721)
- issueCertificate(holder, tokenId, amount, burnTx, evidenceCID) onlyRegistry
- tokenURI(certificateId) → IPFS metadata linking burn and evidence
- Events: CertificateIssued

Token ID Encoding

tokenId = keccak256(projectId || vintageYear || methodologyId) truncated to uint256

Flows

Mint
1) Oracle posts MRVAttested to Registry with evidenceCID
2) Admin/Verifier triggers mint authorization for tokenId and amount
3) Registry calls Credits1155.mintAuthorized

Retire
1) User calls Credits1155.burnForRetirement(tokenId, amount)
2) Registry verifies burn and calls Retirement721.issueCertificate
3) Certificate minted with metadata { projectId, vintage, amount, evidenceCID, burnTx }

Access Control & Safety

- OpenZeppelin AccessControl, Pausable, ReentrancyGuard
- EIP-712 signatures for oracle payloads
- Nonce/expiry for oracle submissions
- Upgradeability (optional): UUPS with timelock governance

Metadata (IPFS JSON)

- ERC-1155: name, description, image(optional), attributes: projectId, vintage, methodology, tCO2ePerUnit, evidenceCID
- ERC-721: name, description, image(optional), attributes: projectId, vintage, amountRetired, burnTx, evidenceCID


