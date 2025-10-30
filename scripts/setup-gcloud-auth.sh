#!/usr/bin/env bash -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="felix-tech-production"
SERVICE_ACCOUNT="nightveil-sandbox@felix-technologies.iam.gserviceaccount.com"
SERVICE_ACCOUNT_KEY="$HOME/.config/gcloud/nightveil-sandbox.json"

echo -e "${BLUE}🔐 Setting up Google Cloud authentication for Nightveil project...${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    echo -e "${YELLOW}📖 Installation guide: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi

# Check if user is authenticated with gcloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${YELLOW}⚠️  You are not authenticated with gcloud. Setting up authentication...${NC}"

    # Run login
    echo -e "${BLUE}🔐 Running gcloud auth login...${NC}"
    if gcloud auth login; then
        echo -e "${GREEN}✅ Login successful!${NC}"
    else
        echo -e "${RED}❌ Login failed.${NC}"
        exit 1
    fi

    # Run application-default login
    echo -e "${BLUE}🔐 Running gcloud auth application-default login...${NC}"
    if gcloud auth application-default login; then
        echo -e "${GREEN}✅ Application default login successful!${NC}"
    else
        echo -e "${RED}❌ Application default login failed.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Already authenticated with gcloud${NC}"
fi

# Check if user has access to the project
if ! gcloud projects describe "$PROJECT_ID" &> /dev/null; then
    echo -e "${RED}❌ You don't have access to project: $PROJECT_ID${NC}"
    echo -e "${YELLOW}📖 Please ensure you have the necessary permissions.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project access verified: $PROJECT_ID${NC}"

# Create service account key if it doesn't exist
if [ ! -f "$SERVICE_ACCOUNT_KEY" ]; then
    echo -e "${BLUE}🔑 Creating service account key...${NC}"

    # Ensure the directory exists
    mkdir -p "$HOME/.config/gcloud"

    # Create the service account key
    if gcloud iam service-accounts keys create "$SERVICE_ACCOUNT_KEY" \
        --iam-account "$SERVICE_ACCOUNT"; then
        echo -e "${GREEN}✅ Service account key created successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to create service account key.${NC}"
        echo -e "${YELLOW}💡 Make sure you have the necessary permissions to create service account keys.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Service account key already exists at $SERVICE_ACCOUNT_KEY${NC}"
fi

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
echo -e "${BLUE}🔧 Setting GOOGLE_APPLICATION_CREDENTIALS environment variable...${NC}"
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_KEY"
echo -e "${GREEN}✅ GOOGLE_APPLICATION_CREDENTIALS set to: $GOOGLE_APPLICATION_CREDENTIALS${NC}"

# Add to shell profile for persistence (optional)
SHELL_PROFILE=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_PROFILE="$HOME/.bash_profile"
fi

if [ -n "$SHELL_PROFILE" ]; then
    # Check if the export line already exists
    if ! grep -q "GOOGLE_APPLICATION_CREDENTIALS.*nightveil-sandbox.json" "$SHELL_PROFILE"; then
        echo -e "${BLUE}📝 Adding GOOGLE_APPLICATION_CREDENTIALS to $SHELL_PROFILE for persistence...${NC}"
        echo "" >> "$SHELL_PROFILE"
        echo "# Google Cloud credentials for Nightveil project" >> "$SHELL_PROFILE"
        echo "export GOOGLE_APPLICATION_CREDENTIALS=\"$SERVICE_ACCOUNT_KEY\"" >> "$SHELL_PROFILE"
        echo -e "${GREEN}✅ Added to $SHELL_PROFILE for future sessions${NC}"
    else
        echo -e "${GREEN}✅ GOOGLE_APPLICATION_CREDENTIALS already configured in $SHELL_PROFILE${NC}"
    fi
fi

echo -e "${BLUE}📋 Authentication Summary:${NC}"
echo -e "   • gcloud CLI: ${GREEN}✓ Installed${NC}"
echo -e "   • gcloud auth: ${GREEN}✓ Authenticated${NC}"
echo -e "   • Project access: ${GREEN}✓ Verified${NC}"
echo -e "   • Service account key: ${GREEN}✓ Created${NC}"
echo -e "   • Environment variable: ${GREEN}✓ Set${NC}"
echo -e "   • Shell profile: ${GREEN}✓ Updated${NC}"

echo -e "${GREEN}🎉 Google Cloud authentication setup completed successfully!${NC}"