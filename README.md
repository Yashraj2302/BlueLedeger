# BlueLedger System: Blockchain-Based Blue Carbon Registry and MRV System

## Problem Statement (SIH25038)
**Theme**: Environment & Climate Tech

BlueLedger System is a blockchain-based registry that mints, sells, and retires blue carbon credits. Blue carbon refers to carbon captured by the world's ocean and coastal ecosystems. The system aims to turn coastal restoration into a verifiable climate currency.

## Proposed Solution: BlueLedger System

### How the System Works

1. **Project Onboarding**: A user onboards a project using a GeoJSON file containing coastal ecosystem boundaries and metadata.

2. **Measurement, Reporting, and Verification (MRV)**: The system uses satellite imagery and field data for MRV, leveraging Google Earth Engine and the NDVI Biomass Model for accurate carbon measurement.

3. **Oracle Integration**: A Chainlink oracle brings the real-world MRV data onto the blockchain, ensuring data integrity and transparency.

4. **Token Minting**: The system mints tokens using the ERC-1155 standard, with evidence stored on IPFS for immutable verification.

5. **Credit Retirement**: Credits are retired using an ERC-721 token, resulting in a unique NFT retirement certificate that prevents double-counting.

6. **Revenue Sharing**: The process provides revenue sharing for coastal communities, with payments handled using MetaMask Wallet and USDC.

### Key Features
- **Prevents Double-Counting**: Unique token IDs and retirement certificates ensure each credit is counted only once
- **Auditable Verification**: All MRV data and evidence are immutably stored on IPFS and blockchain
- **Community Revenue Sharing**: Transparent payment system supporting coastal communities
- **Transparent Payments**: MetaMask integration with USDC for seamless transactions

## Technology and Feasibility

The project uses a modular, open-source technology stack:

- **Frontend**: React and Tailwind CSS
- **Backend**: Node.js and Express  
- **Blockchain**: Solidity, deployed on Polygon/Arbitrum, using ERC-1155 and ERC-721 standards
- **Storage**: IPFS and Filecoin

### Risk Mitigation

The team has identified and provided mitigations for potential risks:
- **Data Accuracy**: Satellite noise issues addressed through temporal compositing and field validation
- **High Gas Fees**: L2 deployment (Polygon/Arbitrum) and batch processing
- **Community Onboarding**: Simplified UX and custodial options for easier adoption

## Key Performance Indicators (KPIs)

**2025 Pilot Targets**:
- **3 projects** onboarded
- **10,000 tCO2e** (tonnes of carbon dioxide equivalent) measured
- **500 credits** issued
- **Generated revenue** for coastal communities

## Long-term Vision

The long-term vision is to use APIs and DAO governance to create a national registry, enabling:
- **Scalable Blue Carbon Markets**: Nationwide adoption of blue carbon credit trading
- **Community Empowerment**: Direct revenue sharing with coastal communities
- **Climate Impact**: Significant contribution to India's carbon neutrality goals
- **Transparent Governance**: Decentralized decision-making through DAO mechanisms

High-Level Flow

1) Project Onboarding → Upload GeoJSON + metadata
2) MRV Run → GEE computes NDVI/biomass; field data calibrates; results exported
3) Oracle Attestation → Chainlink posts MRV summary hash and data to contract
4) Mint Credits → ERC-1155 tokens minted, linked to IPFS evidence CIDs
5) Payment & Transfer → USDC via MetaMask
6) Retirement → Burn ERC-1155, mint ERC-721 certificate (NFT)

Risks & Mitigations

- Satellite noise / data accuracy → Temporal compositing, QA masks, field plots, uncertainty bounds
- High gas fees → Batch mints, L2 (Polygon/Arbitrum), off-chain storage of heavy artifacts
- Community onboarding → Simple UX, custodial options, revenue share templates, local partners
- Oracle integrity → DON-based oracles, signed payloads, replay protection, versioned schemas

Roadmap

- MVP: Project onboarding, MRV ingest, oracle attestation, ERC-1155 mint, ERC-721 retire
- V1: Marketplace integration, USDC flows, verifier roles, dashboards
- V2: APIs for third-party registries and DAO governance toward a national registry

Repository Structure

- docs/ — Architecture, MRV, API, contracts specs
- contracts/ — Solidity contracts and tests
- backend/ — Node.js/Express services
- frontend/ — React/Tailwind app
- scripts/ — Dev tooling and deployment scripts

Getting Started (MVP dev)

- Frontend: React + Tailwind scaffolding
- Backend: Express service with endpoints for projects, MRV submissions, and oracle webhooks
- Contracts: Deploy ERC-1155 credits and ERC-721 retirements on a testnet
- Storage: Pin MRV artifacts to IPFS and capture CIDs on-chain

License

Apache-2.0 (proposed). Update as needed for SIH submission.


