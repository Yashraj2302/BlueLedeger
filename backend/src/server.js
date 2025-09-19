const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const projectRoutes = require('./routes/projects');
const mrvRoutes = require('./routes/mrv');
const oracleRoutes = require('./routes/oracle');
const mintRoutes = require('./routes/mint');
const retirementRoutes = require('./routes/retirement');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/mrv', mrvRoutes);
app.use('/api/v1/oracle', oracleRoutes);
app.use('/api/v1/mint', mintRoutes);
app.use('/api/v1/retire', retirementRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`BlueLedger Backend running on port ${PORT}`);
});
