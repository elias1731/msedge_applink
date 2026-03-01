// Standardeinstellungen: 'off', 'app' oder 'livecontainer'
let settings = {
    spotify: 'off',
    youtube: 'off',
    ytmusic: 'off'
};

function loadSettings() {
    chrome.storage.sync.get(['appLinkSettings'], (data) => {
        if (data.appLinkSettings) {
            settings = data.appLinkSettings;
        }
    });
}

// Initial laden
loadSettings();

// Auf Änderungen im Popup reagieren
chrome.storage.onChanged.addListener((changes) => {
    if (changes.appLinkSettings) {
        settings = changes.appLinkSettings.newValue || settings;
    }
});

// URL-Navigation abfangen
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId !== 0) return; // Nur Haupt-Frames beachten

    const url = details.url;
    if (!url.startsWith('http')) return;

    let targetUri = null;
    let service = null;

    // 1. YouTube Music Prüfung (muss vor normalem YouTube geprüft werden)
    if (url.startsWith('http://music.youtube.com/') || url.startsWith('https://music.youtube.com/')) {
        service = 'ytmusic';
        if (settings.ytmusic !== 'off') {
            const rest = url.replace(/^https?:\/\/music\.youtube\.com\//, '');
            targetUri = 'youtubemusic://music.youtube.com/' + rest;
        }
    }
    // 2. YouTube Prüfung
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
    // 3. Spotify Prüfung
    else if (url.includes('spotify.com')) {
        service = 'spotify';
        if (settings.spotify !== 'off') {
            // Sucht nach /track/, /artist/, /album/ oder /playlist/ gefolgt vom Rest der URL
            const match = url.match(/(track|artist|album|playlist)\/(.*)/);
            if (match) {
                targetUri = 'spotify://' + match[1] + '/' + match[2];
            }
        }
    }

    // Falls ein passender Service aktiv ist und eine Ziel-URI generiert wurde
    if (targetUri && service && settings[service] !== 'off') {
        let finalUrl = targetUri;

        // Falls LiveContainer ausgewählt ist, Base64 codieren
        if (settings[service] === 'livecontainer') {
            // btoa encodiert den String in Base64
            finalUrl = 'livecontainer://open-web-page?url=' + btoa(targetUri);
        }

        // Leitet den Tab um
        chrome.tabs.update(details.tabId, { url: finalUrl });
    }
});