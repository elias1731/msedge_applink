<div id="toc">
  <ul align="center" style="list-style: none">
    <br>
    <img src="./images/icon.png" alt="Logo" width="128">
    <br>
    <summary>
      <h1 style="border-bottom: 0; display: inline-block;">
        <b><u>AppLink</u></b></br>
          <sub><i>Browser Extension</i> 🌐</sub></h1>
    </summary>
Simple App Redirection for Spotify, YouTube, and YT Music !
  </ul>
</div>

> [!NOTE]
> ⚠️ **Designed for iOS/iPadOS!**
> While this extension is technically functional on Desktop and Android, it is practically useless there.
> <details>
> <summary><strong>Read why</strong></summary>
> 
> 1. **Desktop:** The extension heavily relies on specific custom URI schemes (such as `youtube://` or `livecontainer://`) that are simply not supported in desktop environments.
> 2. **Android:** The extension is entirely redundant here. Android natively handles deep links and opens apps by default anyway. This built-in OS behavior works perfectly right out of the box, even for sideloaded applications.
> 
> </details>


## What is **AppLink** ?

AppLink is a lightweight browser extension that automatically detects Spotify, YouTube, and YouTube Music URLs and redirects them either to their native Apps or to the respective app inside 'LiveContainer'. Finally an 'Open in app...' experience as it should be by default!

## Features

'AppLink' continuously monitors your browser’s navigation events in the background. When it detects URLs from Spotify, YouTube, or YouTube Music, it intelligently reroutes them based on your personalized preferences.

### The extension provides a simple popup menu with two categories:

1. 'Open in App'
    - Redirects to native or sideloaded App
2. 'Open in LiveContainer'
    - Redirects to the respective App inside **LiveContainer**
    You can toggle each service independently.

## Privacy

- No personal data collected.

## Source Code & Support

Check out the source code on GitHub: [https://github.com/Bitte-ein-Git/applink-extension](https://github.com/Bitte-ein-Git/applink-extension)