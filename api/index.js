const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import API routes
const projectRoutes = require('./routes/projects');
const mrvRoutes = require('./routes/mrv');
const oracleRoutes = require('./routes/oracle');
const mintRoutes = require('./routes/mint');
const retirementRoutes = require('./routes/retirement');
const adminRoutes = require('./routes/admin');

// Routes
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/mrv', mrvRoutes);
app.use('/api/v1/oracle', oracleRoutes);
app.use('/api/v1/mint', mintRoutes);
app.use('/api/v1/retire', retirementRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'BlueLedger API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'BlueLedger API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      projects: '/api/v1/projects',
      mrv: '/api/v1/mrv',
      oracle: '/api/v1/oracle',
      mint: '/api/v1/mint',
      retire: '/api/v1/retire'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
