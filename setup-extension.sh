#!/bin/bash

# ScrapeSense Extension Setup Script

echo "🤖 ScrapeSense Chrome Extension Setup"
echo "======================================"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist/ folder not found. Building extension..."
    npm run build
else
    echo "✅ dist/ folder found"
fi

# Show file sizes
echo ""
echo "📦 Built Files:"
ls -lh dist/*.js dist/*.html 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}'

echo ""
echo "🚀 Next Steps:"
echo "1. Open Chrome: chrome://extensions/"
echo "2. Enable 'Developer mode' (top-right toggle)"
echo "3. Click 'Load unpacked'"
echo "4. Select: $(pwd)/dist"
echo ""
echo "✅ Extension loaded! Visit any website to see ScrapeSense in action."
echo ""
echo "📚 Documentation: See EXTENSION_README.md and SETUP_GUIDE.md"
