# AppLink Extension

AppLink is a lightweight browser extension that automatically intercepts web URLs for specific media services and seamlessly redirects them either to their native applications or routes them through LiveContainer.

## Supported Services
- **Spotify** (Tracks, Artists, Albums, Playlists)
- **YouTube** (including `youtu.be` links)
- **YouTube Music**

## Features & Redirection Logic
The extension provides a simple popup menu with two main categories. You can toggle each service independently. Note: A service can only be active in **one** category at a time (Mutual Exclusivity).

### 1. Open in App
Redirects regular web URLs directly into the native app's custom URI scheme.
* **Spotify:** `http(s)://...spotify.com/.../<type>/<rest>` &rarr; `spotify://<type>/<rest>`
* **YouTube:** `https://www.youtube.com/<rest>` &rarr; `youtube://youtube.com/<rest>`
* **YouTube Music:** `https://music.youtube.com/<rest>` &rarr; `youtubemusic://music.youtube.com/<rest>`

### 2. Open in LiveContainer
Instead of opening the app normally, this mode takes the generated custom URI, encodes it into base64, and passes it to LiveContainer.
* Example for YouTube: `https://www.youtube.com/watch?v=123`
* Target URI becomes: `youtube://youtube.com/watch?v=123`
* Encoded and redirected to: `livecontainer://open-web-page?url=eW91dHViZTovL3lvdXR1YmUuY29tL3dhdGNoP3Y9MTIz`

## Installation
1. Download or clone this repository.
2. Open your Chromium-based browser (Edge/Chrome) and navigate to the extensions page (`edge://extensions` or `chrome://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the folder containing this extension.
5. Click the extension icon in your toolbar to configure your routing rules!