# YouTube Shorts Title Display - Chrome Extension

A minimalist Google Chrome Extension (Manifest V3) that extracts title text from `aria-label` attributes on YouTube Shorts lockup items and renders it directly inside `<h3 class="shortsLockupViewModelHostMetadataTitle">` elements, making Shorts titles immediately visible on `youtube.com`.

## Features

- **Zero Permissions**: Pure content script implementation with no permissions required (`permissions` and `host_permissions` are not needed).
- **Initial & Dynamic HTML Support**: Works on initial page load and continuously updates as new HTML content loads while scrolling or navigating on YouTube.
- **Targeted Element Extraction**: Reads the `aria-label` from `<h3 class="shortsLockupViewModelHostMetadataTitle">` within YouTube's `<ytd-rich-item-renderer>` and `<ytm-shorts-lockup-view-model>` components.
- **Clean Title Formatting**: Strips trailing view counts (e.g. `, 3.9K views - play Short`) to render clean, readable video titles.
- **Dynamic DOM Observer**: Powered by high-performance `MutationObserver` and YouTube SPA navigation event listeners (`yt-navigate-finish`).

## Minimalist Manifest V3

```json
{
  "manifest_version": 3,
  "name": "YouTube Shorts Title Display",
  "version": "1.0.0",
  "description": "Displays visible title text extracted from aria-label attributes on YouTube Shorts lockup items dynamically.",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "content_scripts": [
    {
      "matches": [
        "*://*.youtube.com/*"
      ],
      "js": [
        "content.js"
      ],
      "css": [
        "styles.css"
      ],
      "run_at": "document_idle"
    }
  ]
}
```

## How to Install in Google Chrome

1. Open **Google Chrome**.
2. Navigate to `chrome://extensions` in the address bar.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click the **Load unpacked** button in the top-left menu.
5. Select the project directory:
   `/home/nirmanyu/Music/git_projects/yt-web-shorts-display`
6. Open [YouTube.com](https://www.youtube.com) and view the Shorts grid items with visible titles!
