# BlueLedger Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js installed

### 2. Deploy via Vercel Dashboard

#### Option A: Import from Git Repository
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import your repository
5. Configure build settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Option B: Deploy API Separately
1. Create a new project for the API
2. Set **Root Directory**: `api`
3. Set **Build Command**: `npm install`
4. Set **Output Directory**: `.`

### 3. Environment Variables
Set these in Vercel dashboard under Project Settings > Environment Variables:

```
REACT_APP_BACKEND_URL=https://your-api-project.vercel.app/api
REACT_APP_CHAIN_ID=137
REACT_APP_NETWORK=polygon
REACT_APP_CONTRACT_ADDRESSES={"Registry":"0x...","Credits1155":"0x...","Retirement721":"0x..."}
```

### 4. Deploy via CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod

# Deploy API (in separate terminal)
cd api
vercel --prod
```

### 5. Project Structure for Vercel

```
blue-ledger/
├── frontend/          # React app
│   ├── vercel.json
│   ├── package.json
│   └── src/
├── api/              # Serverless functions
│   ├── vercel.json
│   ├── package.json
│   ├── index.js
│   └── routes/
├── contracts/        # Smart contracts
├── docs/            # Documentation
└── vercel.json      # Root config
```

### 6. API Endpoints

Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/health`
- `https://your-project.vercel.app/api/v1/projects`
- `https://your-project.vercel.app/api/v1/mrv`
- `https://your-project.vercel.app/api/v1/oracle`
- `https://your-project.vercel.app/api/v1/mint`
- `https://your-project.vercel.app/api/v1/retire`

### 7. Testing Deployment

```bash
# Test API health
curl https://your-project.vercel.app/api/health

# Test projects endpoint
curl https://your-project.vercel.app/api/v1/projects
```

### 8. Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 🔧 Troubleshooting

### Build Errors
- Check Node.js version (use 18.x)
- Verify all dependencies are in package.json
- Check for TypeScript errors

### API Errors
- Verify environment variables are set
- Check function logs in Vercel dashboard
- Ensure CORS is properly configured

### Frontend Errors
- Verify REACT_APP_* environment variables
- Check browser console for errors
- Ensure API URLs are correct

## 📊 Monitoring

- View deployment logs in Vercel dashboard
- Monitor API performance in Functions tab
- Check analytics in Overview tab

## 🔄 Updates

To update your deployment:
1. Push changes to your Git repository
2. Vercel will automatically redeploy
3. Or manually trigger deployment in dashboard

## 🎯 Next Steps

1. Deploy smart contracts to Polygon/Arbitrum
2. Update contract addresses in environment variables
3. Connect real IPFS storage
4. Implement Chainlink oracle integration
5. Add authentication and user management
