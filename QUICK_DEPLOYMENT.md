# 🚀 Quick Deployment Guide - BlueLedger System

## Option 1: Vercel Dashboard (Easiest)

### Step 1: Deploy Frontend
1. **Go to**: https://vercel.com/dashboard
2. **Click**: "New Project"
3. **Import Repository**: `Yashraj2302/BlueLedeger`
4. **Configure**:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. **Deploy**

### Step 2: Deploy API
1. **Create Another Project** in Vercel
2. **Import Same Repository**: `Yashraj2302/BlueLedeger`
3. **Configure**:
   - **Framework**: Other
   - **Root Directory**: `api`
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
4. **Deploy**

## Option 2: Vercel CLI

### Deploy Frontend
```bash
cd frontend
vercel --prod
# Answer: Y (Yes)
# Follow prompts to link to GitHub
```

### Deploy API
```bash
cd api
vercel --prod
# Answer: Y (Yes)
# Follow prompts to link to GitHub
```

## Expected URLs After Deployment

- **Frontend**: `https://blue-ledger.vercel.app`
- **API**: `https://blue-ledger-api.vercel.app`

## Environment Variables to Set

### Frontend (in Vercel Dashboard)
```
REACT_APP_BACKEND_URL=https://your-api-url.vercel.app/api
REACT_APP_CHAIN_ID=137
REACT_APP_NETWORK=polygon
```

### API (in Vercel Dashboard)
```
NODE_ENV=production
JWT_SECRET=your_jwt_secret_here
```

## Testing Your Deployment

### Test Frontend
```bash
curl https://your-frontend-url.vercel.app
```

### Test API
```bash
# Health check
curl https://your-api-url.vercel.app/api/health

# Projects endpoint
curl https://your-api-url.vercel.app/api/v1/projects
```

## Troubleshooting

### Build Errors
- Check Node.js version (use 18.x)
- Verify all dependencies are installed
- Check for TypeScript errors

### API Errors
- Verify environment variables are set
- Check function logs in Vercel dashboard
- Ensure CORS is properly configured

## Success! 🎉

Once deployed, you'll have:
- ✅ Live BlueLedger System demo
- ✅ Ready for SIH 2025 presentation
- ✅ Public GitHub repository
- ✅ Professional deployment

## Next Steps

1. **Deploy smart contracts** to Polygon/Arbitrum
2. **Update contract addresses** in environment variables
3. **Test full system** end-to-end
4. **Prepare presentation** for SIH 2025
