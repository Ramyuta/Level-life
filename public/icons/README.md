# PWA Icon Generation Script

This directory contains the Level-Life app icons in various sizes required for PWA.

## Icon Sizes Required

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## How to Generate Icons

### Option 1: Using Online Tools

1. Use the generated icon at `C:/Users/yuuta/.gemini/antigravity/brain/be73d59d-da95-4a9c-bafc-b0793cfa44f7/level_life_icon_1764538597142.png`
2. Visit https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
3. Upload the icon
4. Download all sizes
5. Place them in this directory

### Option 2: Using ImageMagick (if installed)

```bash
# Install ImageMagick first: https://imagemagick.org/
# Then run:
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
```

### Option 3: Using Sharp (Node.js)

```bash
npm install sharp
node generate-icons.js
```

## Temporary Solution

For now, you can use the SVG icon (`/icon.svg`) as a fallback, or copy the generated PNG to all required sizes.

The app will still work without all icon sizes, but having them improves the user experience on different devices.
