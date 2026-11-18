#!/bin/bash
set -e

echo "============================================================"
echo "🚀 Push AI-Native Product Catalogue to Your GitHub"
echo "============================================================"
echo ""
echo "1. Go to https://github.com/new and create a new PUBLIC repository"
echo "   (e.g., named 'ai-product-catalogue' or 'ai-native-product-catalogue')"
echo "   Do NOT initialize with a README, .gitignore, or license."
echo ""
read -p "Enter your GitHub repository URL (e.g. https://github.com/your-username/ai-product-catalogue.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "❌ Error: Repository URL cannot be empty."
  exit 1
fi

echo ""
echo "Adding git remote 'origin'..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "Pushing 'main' branch..."
git push -u origin main

echo "Pushing 'feature/product-catalogue-mvp' branch..."
git push -u origin feature/product-catalogue-mvp

echo ""
echo "============================================================"
echo "✅ Code successfully pushed to GitHub!"
echo "============================================================"
echo ""
echo "Next step: Open your GitHub repository in your browser."
echo "GitHub will show a banner to open a Pull Request from:"
echo "   'feature/product-catalogue-mvp' into 'main'"
echo ""
echo "Copy the pre-written PR title & description from:"
echo "   PR_DESCRIPTION.md"
echo ""
echo "Leave the Pull Request OPEN as requested by the reviewers."
echo "============================================================"
