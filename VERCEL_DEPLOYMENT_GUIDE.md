# Vercel Deployment Guide for BlueLedger

## 🚀 Deploy from GitHub Repository

Your repository is ready at: https://github.com/Yashraj2302/BlueLedeger

### Method 1: Vercel Dashboard (Recommended)

#### Step 1: Deploy Frontend
1. **Go to**: https://vercel.com/dashboard
2. **Click**: "New Project"
3. **Import Repository**:
   - Select "Import Git Repository"
   - Choose your GitHub account
   - Select `Yashraj2302/BlueLedeger`
4. **Configure Frontend**:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. **Environment Variables**:
   ```
   REACT_APP_BACKEND_URL=https://your-api-project.vercel.app/api
   REACT_APP_CHAIN_ID=137
   REACT_APP_NETWORK=polygon
   ```
6. **Click**: "Deploy"

#### Step 2: Deploy API
1. **Create Another Project** in Vercel
2. **Import Same Repository**: `Yashraj2302/BlueLedeger`
3. **Configure API**:
   - **Framework Preset**: Other
   - **Root Directory**: `api`
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
4. **Click**: "Deploy"

### Method 2: Vercel CLI

#### Deploy Frontend
```bash
cd frontend
vercel --prod
# Follow prompts to link to GitHub repository
```

#### Deploy API
```bash
cd api
vercel --prod
# Follow prompts to link to GitHub repository
```

## 🔧 Configuration

### Frontend Environment Variables
Set these in Vercel Dashboard > Project Settings > Environment Variables:

```
REACT_APP_BACKEND_URL=https://blue-ledger-api.vercel.app/api
REACT_APP_CHAIN_ID=137
REACT_APP_NETWORK=polygon
REACT_APP_CONTRACT_ADDRESSES={"Registry":"0x...","Credits1155":"0x...","Retirement721":"0x..."}
```

### API Environment Variables
```
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_PROJECT_ID=your_infura_project_id
IPFS_PROJECT_SECRET=your_infura_project_secret
```

## 📊 Project Structure for Vercel

```
Yashraj2302/BlueLedeger/
├── frontend/          # React app (Deploy as Project 1)
│   ├── vercel.json
│   ├── package.json
│   └── src/
├── api/              # Serverless functions (Deploy as Project 2)
│   ├── vercel.json
│   ├── package.json
│   ├── index.js
│   └── routes/
└── contracts/        # Smart contracts (Deploy separately)
```

## 🎯 Expected URLs

After deployment, you'll have:
- **Frontend**: `https://blue-ledger.vercel.app`
- **API**: `https://blue-ledger-api.vercel.app`

## 🔄 Automatic Deployments

Once connected to GitHub:
- **Every push** to `main` branch triggers automatic deployment
- **Preview deployments** for pull requests
- **Rollback** capability for previous versions

## 🧪 Testing Deployment

### Test Frontend
```bash
curl https://blue-ledger.vercel.app
```

### Test API Endpoints
```bash
# Health check
curl https://blue-ledger-api.vercel.app/api/health

# Projects
curl https://blue-ledger-api.vercel.app/api/v1/projects

# MRV
curl https://blue-ledger-api.vercel.app/api/v1/mrv/proj_001/latest
```

## 🚨 Troubleshooting

### Build Errors
- Check Node.js version (use 18.x)
- Verify all dependencies in package.json
- Check for TypeScript errors

### API Errors
- Verify environment variables are set
- Check function logs in Vercel dashboard
- Ensure CORS is properly configured

### Frontend Errors
- Verify REACT_APP_* environment variables
- Check browser console for errors
- Ensure API URLs are correct

## 📈 Monitoring

- **Analytics**: View in Vercel dashboard
- **Logs**: Check function logs
- **Performance**: Monitor Core Web Vitals

## 🎉 Success!

Once deployed, your BlueLedger system will be live and ready for:
- SIH 2025 presentation
- Team collaboration
- Public demonstration
- Further development

## 🔗 Quick Links

- **GitHub Repository**: https://github.com/Yashraj2302/BlueLedeger
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Frontend Preview**: https://blue-ledger.vercel.app (after deployment)
- **API Preview**: https://blue-ledger-api.vercel.app (after deployment)
