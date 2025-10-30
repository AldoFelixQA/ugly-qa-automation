#!/usr/bin/env bash -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NPMRC_FILE=".npmrc"

echo -e "${BLUE}🔧 Setting up .npmrc file for Nightveil project...${NC}"

# Check if .npmrc already exists
if [ -f "$NPMRC_FILE" ]; then
    echo -e "${YELLOW}⚠️  .npmrc file already exists. Backing up to .npmrc.backup${NC}"
    cp "$NPMRC_FILE" "$NPMRC_FILE.backup"
fi

# Create .npmrc file with basic configuration
echo -e "${BLUE}📝 Creating .npmrc file...${NC}"

cat > "$NPMRC_FILE" << EOF
# General NPM settings
engine-strict=true
resolution-mode=highest
EOF

echo -e "${GREEN}✅ Basic .npmrc file created successfully!${NC}"

# Run the gcloud authentication setup script first
echo -e "${BLUE}🔐 Setting up Google Cloud authentication...${NC}"

# Check if the authentication script exists
if [ -f "scripts/setup-gcloud-auth.sh" ]; then
    # Run the authentication setup script
    if ./scripts/setup-gcloud-auth.sh; then
        echo -e "${GREEN}✅ Google Cloud authentication completed successfully!${NC}"
    else
        echo -e "${RED}❌ Google Cloud authentication failed.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Authentication setup script not found at scripts/setup-gcloud-auth.sh${NC}"
    exit 1
fi

# Run the overseer registry setup script
echo -e "${BLUE}🔧 Setting up overseer registry configuration...${NC}"

# Check if the overseer registry script exists
if [ -f "scripts/setup-overseer-registry.sh" ]; then
    # Run the overseer registry setup script
    if ./scripts/setup-overseer-registry.sh; then
        echo -e "${GREEN}✅ Overseer registry configuration completed successfully!${NC}"
    else
        echo -e "${RED}❌ Overseer registry configuration failed.${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Overseer registry setup script not found at scripts/setup-overseer-registry.sh${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Summary:${NC}"
echo -e "   • Basic .npmrc file: ${GREEN}✓ Created${NC}"
echo -e "   • Overseer registry: ${GREEN}✓ Configured${NC}"

echo -e "${GREEN}🚀 You're all set! You can now run npm install and other npm commands.${NC}"