MRV Pipeline: GEE + NDVI Biomass + Oracle

Inputs

- GeoJSON footprint per project
- Field plots (species, DBH/height, biomass samples)
- Satellite datasets: Sentinel-2 (optical), Sentinel-1 (SAR, optional), Landsat (historical)

Processing (GEE)

1) Preprocessing
   - Cloud/shadow masking (S2 QA60/SCL), temporal compositing (median over windows)
   - NDVI computation; optional EVI/SAVI for robustness
2) Biomass Model
   - Calibrate NDVI→AGB (above-ground biomass) via field plots (regression/ML)
   - Propagate uncertainty (confidence intervals)
3) Carbon & tCO2e
   - Convert AGB to carbon (species-specific factors) → tC
   - tCO2e = tC × 44/12
4) Vintage Allocation
   - Compute delta per vintage/year, bounded by uncertainty
5) Export
   - Raster/Vector exports; summary JSON; checksums

Evidence Bundle (IPFS)

- manifest.json: dataset versions, model params, code refs, checksums
- metrics.json: area, AGB, tCO2e, uncertainty, vintage allocations
- geo.json: project footprint
- optional: thumbnails, charts

Oracle Attestation (Chainlink)

- Backend signs summary payload: { projectId, vintage, tCO2e, evidenceCID, metricsHash, expiry }
- Chainlink job pulls, verifies schema/version, relays EIP-712-signed payload on-chain

Schema Versioning

- mrv.schemaVersion follows semver; contracts store version per attestation
- Breaking changes require contract-allowed versions list

Quality Controls

- Cross-sensor validation (S1/S2/Landsat)
- Spatial QA (footprint consistency, leakage checks)
- Temporal QA (seasonality windows)
- Independent verifier approval


