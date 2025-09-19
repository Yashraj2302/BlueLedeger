# GitHub Repository Setup Guide

## 🐙 Step-by-Step Instructions

### 1. Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account
3. **Click "New"** (green button) or "+" → "New repository"
4. **Fill in details**:
   - **Repository name**: `blue-ledger`
   - **Description**: `Blockchain-based blue carbon credit registry and MRV system for SIH 2025`
   - **Visibility**: ✅ Public (recommended for SIH submission)
   - **Initialize**: ❌ Don't check any boxes (we have files already)
5. **Click "Create repository"**

### 2. Connect Local Repository

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/blue-ledger.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### 3. Alternative: Using GitHub Desktop

If you prefer a GUI:
1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Open GitHub Desktop**
3. **File** → **Add Local Repository**
4. **Choose** your `sih` folder
5. **Publish repository** to GitHub

### 4. Verify Setup

After pushing, your repository should be available at:
`https://github.com/YOUR_USERNAME/blue-ledger`

## 📁 Repository Structure

Your repository will contain:
```
blue-ledger/
├── 📁 frontend/          # React app
├── 📁 api/              # Vercel serverless functions
├── 📁 backend/          # Express server
├── 📁 contracts/        # Smart contracts
├── 📁 docs/            # Documentation
├── 📁 samples/         # Sample data
├── 📄 README.md        # Project overview
├── 📄 DEPLOYMENT.md    # Vercel deployment guide
└── 📄 GITHUB_SETUP.md  # This file
```

## 🚀 Next Steps After GitHub Setup

1. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Automatic deployments on every push

2. **Deploy Smart Contracts**:
   - Deploy to Polygon/Arbitrum testnet
   - Update contract addresses in environment variables

3. **Add Team Members**:
   - Invite your SIH team members as collaborators
   - Set up branch protection rules

4. **Set up CI/CD**:
   - GitHub Actions for automated testing
   - Automated contract verification

## 🔧 Troubleshooting

### If you get authentication errors:
```bash
# Configure Git with your GitHub credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### If you get permission errors:
- Make sure you're logged into the correct GitHub account
- Check repository permissions
- Try using SSH instead of HTTPS

### If push fails:
```bash
# Pull any changes first
git pull origin main

# Then push
git push origin main
```

## 📋 Repository Features to Enable

1. **Issues**: Enable for bug tracking
2. **Projects**: Enable for SIH project management
3. **Wiki**: Enable for detailed documentation
4. **Discussions**: Enable for team communication

## 🎯 SIH Submission Ready

Your repository is now ready for:
- ✅ Smart India Hackathon 2025 submission
- ✅ Team collaboration
- ✅ Version control
- ✅ Deployment automation
- ✅ Documentation hosting
