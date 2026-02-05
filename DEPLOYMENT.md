# Azure Deployment Guide

This guide walks you through deploying the Express application to Azure App Service.

## Prerequisites

- Azure subscription
- Azure CLI installed locally
- Node.js 18+ installed
- Git installed
- MongoDB Atlas account with connection string

## Deployment Options

### Option 1: Azure App Service (Recommended - Easiest)

#### Step 1: Create Azure Resources

```bash
# Login to Azure
az login

# Set variables
$resourceGroup = "my-resource-group"
$location = "eastus"
$appServicePlan = "my-app-plan"
$appName = "my-express-app-unique"
$subscription = "YOUR_SUBSCRIPTION_ID"

# Create resource group
az group create --name $resourceGroup --location $location

# Create App Service Plan (Linux, Node.js optimized)
az appservice plan create `
  --name $appServicePlan `
  --resource-group $resourceGroup `
  --sku B1 `
  --is-linux

# Create App Service
az webapp create `
  --resource-group $resourceGroup `
  --plan $appServicePlan `
  --name $appName `
  --runtime "NODE|18-lts"
```

#### Step 2: Configure App Service Settings

```bash
# Set environment variables
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $appName `
  --settings `
    MONGODB_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING" `
    NODE_ENV="production" `
    JWT_SECRET="YOUR_SECURE_JWT_SECRET"
```

#### Step 3: Deploy via Git

```bash
# Create local git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Get the Git deployment URL
$deploymentUrl = az webapp deployment source config-local-git `
  --resource-group $resourceGroup `
  --name $appName `
  --query url --output tsv

# Add Azure remote
git remote add azure $deploymentUrl

# Deploy
git push azure main
```

#### Step 4: Monitor the Application

```bash
# View logs
az webapp log tail --resource-group $resourceGroup --name $appName

# Check application status
$appUrl = "https://$appName.azurewebsites.net"
curl $appUrl/health
```

### Option 2: Azure Container Instances (with Docker)

If you want to use Docker, uncomment the Dockerfile in the project.

```bash
# Create container registry
az acr create --resource-group $resourceGroup --name myregistry --sku Basic

# Build and push image
az acr build --registry myregistry --image express-app:latest .

# Deploy to Container Instances
az container create `
  --resource-group $resourceGroup `
  --name express-app-container `
  --image myregistry.azurecr.io/express-app:latest `
  --port 3000 `
  --cpu 1 `
  --memory 1 `
  --environment-variables MONGODB_URI="YOUR_MONGODB_URI" NODE_ENV="production"
```

### Option 3: GitHub Actions (if using GitHub)

1. Create `.github/workflows/azure-deploy.yml` with the provided template
2. Set GitHub secrets:
   - `AZURE_CREDENTIALS` (service principal)
   - `MONGODB_URI`
   - `JWT_SECRET`
3. Push to main branch to trigger deployment

## Environment Variables

Create a `.env` file based on `.env.example`:

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
JWT_SECRET=your-very-secure-random-secret-here
```

**Never commit the `.env` file** - it contains secrets.

## Database Configuration

For MongoDB Atlas:
1. Go to MongoDB Atlas Dashboard
2. Get your connection string
3. Whitelist Azure App Service IP (or use 0.0.0.0/0 for development)
4. Set MONGODB_URI in Azure App Service settings

## Testing Deployment

```bash
# Test health endpoint
curl https://YOUR_APP_NAME.azurewebsites.net/health

# Test API
curl https://YOUR_APP_NAME.azurewebsites.net/api-docs
```

## Troubleshooting

### App won't start
- Check logs: `az webapp log tail ...`
- Verify environment variables are set
- Confirm MongoDB connection string
- Check Node version compatibility

### CORS or Connection Issues
- Configure CORS in app.js if needed
- Whitelist MongoDB IP in Atlas
- Check Network Security Groups

### Performance Issues
- Scale up App Service plan (B2, S1, etc.)
- Enable Application Insights for monitoring
- Optimize MongoDB queries

## Useful Commands

```bash
# Stop app
az webapp stop --resource-group $resourceGroup --name $appName

# Start app
az webapp start --resource-group $resourceGroup --name $appName

# Restart app
az webapp restart --resource-group $resourceGroup --name $appName

# Delete all resources
az group delete --name $resourceGroup

# Monitor real-time logs
az webapp log tail --resource-group $resourceGroup --name $appName -f

# SSH into app (Linux only)
az webapp create-remote-connection --resource-group $resourceGroup --name $appName
```

## Cost Optimization

- **B1 tier**: Good for dev/test ($10-15/month)
- **B2 tier**: For production apps ($50-80/month)
- **S1 tier**: Scalable production ($60+/month)
- Use Azure Monitor for alerts

## Next Steps

1. Set up Azure DevOps Pipeline for CI/CD
2. Configure Application Insights for monitoring
3. Set up auto-scaling based on metrics
4. Configure custom domain and SSL certificate
5. Set up backup strategy for your database
