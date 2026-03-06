// Default settings object
let settings = {
    spotify: 'off',
    youtube: 'off',
    ytmusic: 'off'
};

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get(['appLinkSettings'], (data) => {
        if (data.appLinkSettings) {
            settings = data.appLinkSettings;
        }
    });
}

// Initial settings load
loadSettings();

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
    if (changes.appLinkSettings) {
        settings = changes.appLinkSettings.newValue || settings;
    }
});

// Intercept web navigation
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId !== 0) return;

    const url = details.url;
    if (!url.startsWith('http')) return;

    let targetUri = null;
    let service = null;

    // Check for YouTube Music
    if (url.startsWith('http://music.youtube.com/') || url.startsWith('https://music.youtube.com/')) {
        service = 'ytmusic';
        if (settings.ytmusic !== 'off') {
            const rest = url.replace(/^https?:\/\/music\.youtube\.com\//, '');
            targetUri = 'youtubemusic://music.youtube.com/' + rest;
        }
    }
    // Check for YouTube
    else if (url.match(/^https?:\/\/(www\.)?youtube\.com\//)) {
        service = 'youtube';
        if (settings.youtube !== 'off') {
            const rest = url.replace(/^https?:\/\/(www\.)?youtube\.com\//, '');
            targetUri = 'youtube://youtube.com/' + rest;
        }
    } else if (url.match(/^https?:\/\/youtu\.be\//)) {
        service = 'youtube';
        if (settings.youtube !== 'off') {
            const rest = url.replace(/^https?:\/\/youtu\.be\//, '');
            targetUri = 'youtube://youtu.be/' + rest;
        }
    }
    // Check for Spotify
    else if (url.includes('spotify.com') || url.includes('spotify.com')) {
        service = 'spotify';
        if (settings.spotify !== 'off') {
            const match = url.match(/(track|artist|album|playlist)\/(.*)/);
            if (match) {
                targetUri = 'spotify://' + match[1] + '/' + match[2];
            }
        }
    }

    // Redirect if target URI is generated
    if (targetUri && service && settings[service] !== 'off') {
        let finalUrl = targetUri;

        if (settings[service] === 'livecontainer') {
            finalUrl = 'livecontainer://open-web-page?url=' + btoa(targetUri);
        }

        chrome.tabs.update(details.tabId, { url: finalUrl });
    }
})