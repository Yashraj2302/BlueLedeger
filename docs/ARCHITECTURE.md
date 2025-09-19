BlueLedger Architecture

Actors

- Project Owner: submits GeoJSON, metadata, and field plots
- Verifier: reviews MRV artifacts and co-signs attestations
- Oracle Node: fetches off-chain MRV results and posts to chain
- Buyer: purchases credits, retires them
- Community DAO/Multisig: receives revenue share

Core Components

- Frontend (React/Tailwind): project onboarding, dashboards, mint/retire UX
- Backend (Express): API for projects, MRV artifacts, oracle webhook, IPFS pinning
- MRV Pipeline (GEE + NDVI model): computes biomass and tCO2e deltas
- Oracle (Chainlink): relays signed MRV summary to smart contracts
- Smart Contracts (Solidity): ERC-1155 credits, ERC-721 retirement certificates, registry
- Storage (IPFS/Filecoin): MRV artifacts, evidence bundles

Data Flow

1) Onboarding
   - Frontend uploads GeoJSON + metadata → Backend stores and pins to IPFS → returns CID
   - Backend creates project record (projectId) with footprint hash

2) MRV
   - MRV job runs in GEE; outputs: NDVI composites, biomass estimates, uncertainty, plots
   - Backend ingests results, computes project-vintage allocation, builds evidence bundle
   - Evidence bundle pinned to IPFS; manifest JSON includes model params, dataset IDs, checksums

3) Oracle Attestation
   - Backend exposes signed MRV summary (hash of evidence + metrics)
   - Chainlink oracle fetches, verifies schema, posts to on-chain registry contract

4) Minting
   - Registry contract authorizes mint on ERC-1155: tokenId encodes projectId+vintage
   - Evidence CID and oracle report ID stored immutably

5) Transfers & Payments
   - Frontend uses MetaMask to handle USDC transfers
   - Optional marketplace integration via ERC-1155 interfaces

6) Retirement
   - Burn ERC-1155 amount; mint ERC-721 certificate with metadata linking to burn tx and evidence
   - Prevents double counting by decrementing supply and recording retirement index

Identifiers & Encoding

- projectId: keccak256(geojson_footprint_bytes || owner || salt)
- tokenId (ERC-1155): concat(projectId, vintageYear, methodologyId)
- certificateId (ERC-721): keccak256(burnTx || owner || timestamp)

Security & Trust

- Role-based access: Admin, Verifier, Oracle
- Reentrancy guards; pausable contracts; EIP-712 typed attestations
- Oracle replay protection via nonce+expiry; maintain schema versioning
- CID pin redundancy across multiple IPFS providers and Filecoin deals

Scalability

- Batch minting/retirements; off-chain heavy data; L2 chains
- Pagination and streaming for artifact retrieval

Observability

- Event logs: ProjectCreated, MRVAttested, CreditsMinted, CreditsRetired, CertificateIssued
- Off-chain telemetry: API metrics, pinning stats, oracle job health

Diagrams (textual)

Frontend → Backend → IPFS
Backend → GEE (MRV) → Backend → IPFS
Oracle → Backend (fetch signed summary) → Registry Contract
Registry → ERC-1155 (mint/burn) → ERC-721 (issue)


