#!/usr/bin/env bash -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NPMRC_FILE=".npmrc"
PROJECT_ID="felix-tech-production"
REPOSITORY="overseer-sdk-ts"
LOCATION="us-central1"
SCOPE="@felix"

echo -e "${BLUE}🔧 Setting up .npmrc file for Overseer registry...${NC}"

# Note: Authentication is handled by the calling script (setup-npmrc.sh)
# This script assumes GOOGLE_APPLICATION_CREDENTIALS is already set

# Check if user has access to the project
if ! gcloud projects describe "$PROJECT_ID" &> /dev/null; then
    echo -e "${RED}❌ You don't have access to project: $PROJECT_ID${NC}"
    echo -e "${YELLOW}📖 Please ensure you have the necessary permissions.${NC}"
    exit 1
fi

# Check if Artifact Registry configuration already exists in .npmrc
ARTIFACT_REGISTRY_CONFIG="$SCOPE:registry=https://$LOCATION-npm.pkg.dev/$PROJECT_ID/$REPOSITORY/"

if grep -q "$ARTIFACT_REGISTRY_CONFIG" "$NPMRC_FILE"; then
    echo -e "${GREEN}✅ Artifact Registry configuration already exists in .npmrc${NC}"
else
    echo -e "${BLUE}📝 Adding Artifact Registry configuration to .npmrc...${NC}"

    # Append the Artifact Registry configuration to the existing .npmrc
    cat >> "$NPMRC_FILE" << EOF
# Auth for Google Artifact Registry (npm) using service account
$SCOPE:registry=https://$LOCATION-npm.pkg.dev/$PROJECT_ID/$REPOSITORY/
//$LOCATION-npm.pkg.dev/$PROJECT_ID/$REPOSITORY/:always-auth=true
EOF

    echo -e "${GREEN}✅ Artifact Registry configuration added to .npmrc${NC}"
fi

echo -e "${BLUE}🔐 Running google-artifactregistry-auth...${NC}"

# Run the authentication command
if npx google-artifactregistry-auth .npmrc; then
    echo -e "${GREEN}✅ Authentication completed successfully!${NC}"
    echo -e "${GREEN}🎉 .npmrc file is ready to use.${NC}"
else
    echo -e "${RED}❌ Authentication failed. Please check your gcloud configuration.${NC}"
    echo -e "${YELLOW}💡 Make sure you have the necessary permissions for Artifact Registry.${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Summary:${NC}"
echo -e "   • Project access: ${GREEN}✓ Verified${NC}"
echo -e "   • Artifact Registry config: ${GREEN}✓ Checked/Added to .npmrc${NC}"
echo -e "   • Artifact Registry auth: ${GREEN}✓ Completed${NC}"

echo -e "${GREEN}🚀 You're all set! You can now run npm install and other npm commands.${NC}"
