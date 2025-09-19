Backend API Specification (MVP)

Base URL

- /api/v1

Auth

- Admin/Verifier auth via JWT or key; user flows mostly public except writes

Resources

1) Projects
- POST /projects
  - body: { name, ownerAddress, geojsonCID | geojsonInline, metadata }
  - resp: { projectId, geojsonCID }
- GET /projects/:projectId
  - resp: { projectId, name, ownerAddress, geojsonCID, status }

2) MRV
- POST /mrv/:projectId/ingest
  - body: { metrics, evidenceCID, schemaVersion }
  - resp: { attestationId, metricsHash }
- GET /mrv/:projectId/latest
  - resp: { attestationId, metrics, evidenceCID }

3) Oracle
- GET /oracle/summary/:attestationId
  - resp: { projectId, vintage, tCO2e, evidenceCID, metricsHash, expiry, signature }

4) Minting
- POST /mint
  - body: { projectId, vintage, amount, evidenceCID, attestationId }
  - resp: { tokenId, txHash }

5) Retirement
- POST /retire
  - body: { holder, tokenId, amount }
  - resp: { certificateId, txHash }

Storage

- IPFS pinning endpoints (internal): /ipfs/pin { file/buffer } → { cid }
- Evidence bundles immutable; versioned by CID

Webhooks

- /webhooks/oracle-callback → validates and records on-chain tx receipts

Errors

- 400 invalid schema; 401 unauthorized; 404 not found; 409 conflict; 500 server


