# Felix Pago Playwright Framework - Setup Guide

This guide will help you set up the Felix Pago Playwright Framework for automated testing of the payment system.

## Prerequisites

### 1. Install Node.js

If Node.js is not installed on your machine, install it using one of these methods:

**Using Homebrew (macOS):**
```bash
brew install node
```

**Using NVM (Node Version Manager):**
```bash
# Install NVM first
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js
nvm install node
nvm use node
```

### 2. Install Google Cloud CLI

**macOS (using Homebrew):**
```bash
brew install --cask google-cloud-sdk
```

**Or download from:**
https://cloud.google.com/sdk/docs/install

## Initial Setup

Once you've cloned the project, run the automated setup script to configure everything:

```bash
# Run the complete setup
npm run setup
```

This script will automatically:

✅ Set up Google Cloud authentication  
✅ Create service account keys  
✅ Configure environment variables  
✅ Set up .npmrc with all necessary registries  
✅ Configure Artifact Registry access  

### What the setup script does:

The `npm run setup` command runs `./scripts/setup-npmrc.sh` which orchestrates three main setup steps:

1. **Basic .npmrc Configuration**: Creates a basic `.npmrc` file with general NPM settings
2. **Google Cloud Authentication**: Runs `./scripts/setup-gcloud-auth.sh` to:
   - Verify gcloud CLI installation
   - Authenticate with Google Cloud (`gcloud auth login`)
   - Set up application default credentials (`gcloud auth application-default login`)
   - Verify access to `felix-tech-production` project
   - Create service account key for `nightveil-sandbox@felix-technologies.iam.gserviceaccount.com`
   - Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
   - Update shell profile for persistence

3. **Overseer Registry Setup**: Runs `./scripts/setup-overseer-registry.sh` to:
   - Configure Artifact Registry access for `@felix` scope
   - Set up authentication for `overseer-sdk-ts` repository
   - Run `google-artifactregistry-auth` for npm authentication

## Development

After the setup is complete, install dependencies and start development:

```bash
# Install project dependencies
npm install

# Install Playwright browsers
npm run install-browsers
```

The setup script automatically handles:
- Google Cloud authentication
- Service account key creation  
- Environment variable configuration
- Shell profile updates for persistence

## Available Scripts

### Setup Scripts
- `npm run setup` - Complete automated setup (recommended)
- `npm run setup-sdk` - Setup TypeScript SDK (if needed)
- `npm run setup-integration` - Setup integration components

### Main Testing Scripts
- `npm run integration-test` - **Main command**: Complete end-to-end testing workflow
- `npm run integration-test:setup` - Order setup only (create order + update fixtures)
- `npm run test:combined-chrome` - Run Playwright tests only (requires order already set up)

### Utility Scripts
- `npm run create-order` - Create test order only
- `npm run test` - Run all Playwright tests
- `npm run test:headed` - Run tests with browser visible
- `npm run test:debug` - Run tests in debug mode
- `npm run test:ui` - Run tests with UI mode
- `npm run report` - Show HTML test report

## Troubleshooting

### Common Issues

#### 1. GCP Credentials Error

If you get this error:
```
Error: Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.
```

**Solutions:**

1. **Refresh your keys (most common solution):**
   ```bash
   npm run refresh:keys
   ```

2. **Run the full setup script again:**
   ```bash
   npm run setup
   ```

3. **Check your gcloud authentication:**
   ```bash
   gcloud auth list
   ```

4. **Verify project access:**
   ```bash
   gcloud projects describe felix-tech-production
   ```

5. **Contact the DevSecOps team** for access permissions

#### 2. Service Account Key Issues

If you encounter service account key problems:

```bash
# Check if the key file exists
ls -la ~/.config/gcloud/nightveil-sandbox.json

# Verify the environment variable
echo $GOOGLE_APPLICATION_CREDENTIALS

# Recreate the service account key
gcloud iam service-accounts keys create ~/.config/gcloud/nightveil-sandbox.json \
  --iam-account=nightveil-sandbox@felix-technologies.iam.gserviceaccount.com
```

#### 3. Artifact Registry Authentication Issues

If you have problems with npm package installation:

```bash
# Re-run Artifact Registry authentication
npx google-artifactregistry-auth .npmrc

# Check your .npmrc file
cat .npmrc
```

#### 4. Node.js Version Issues

Ensure you're using Node.js v16 or higher:

```bash
# Check Node.js version
node --version

# If using NVM, switch to a supported version
nvm install 18
nvm use 18
```

### Manual Verification Steps

After setup, verify everything is working:

```bash
# Test order creation
npm run create-order

# Test Playwright installation
npm run test:headed

# Run a simple integration test
npm run integration-test:setup
```

### Environment Variables

The setup script automatically configures these environment variables:

- `GOOGLE_APPLICATION_CREDENTIALS`: Path to service account key file
- `GCLOUD_PROJECT`: Set to `felix-tech-production`

### File Locations

After successful setup, these files should exist:

- `~/.config/gcloud/nightveil-sandbox.json` - Service account key
- `.npmrc` - NPM configuration with Artifact Registry settings
- Shell profile (`.zshrc`, `.bashrc`, or `.bash_profile`) - Updated with environment variables

## Next Steps

Once setup is complete:

1. **Run the main integration test:**
   ```bash
   npm run integration-test
   ```

2. **Explore the test scenarios:**
   - Successful payment flow
   - Expired link redirect

3. **Check the reports:**
   ```bash
   npm run report
   ```

## Support

If you encounter issues not covered in this guide:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure you have proper access to the `felix-tech-production` project
4. Contact the DevSecOps team for access permissions or technical support

---

**Note**: The setup script automatically handles all configuration steps. If you encounter any issues, running `npm run setup` again should resolve most problems.
