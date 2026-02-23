// Nutzen von chrome.storage für Persistenz
let rules = [];

function updateRules() {
    chrome.storage.sync.get(['appLinkRules'], (data) => {
        rules = data.appLinkRules || [];
    });
}

// Initial laden
updateRules();

// Auf Änderungen reagieren
chrome.storage.onChanged.addListener((changes) => {
    if (changes.appLinkRules) {
        rules = changes.appLinkRules.newValue || [];
    }
});

/**
 * Auf iOS/Mobile ist onBeforeNavigate oft zuverlässiger als declarativeNetRequest 
 * für App-URI-Umleitungen, da der Browser den Handshake zur App besser handhabt.
 */
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    if (details.frameId !== 0 || rules.length === 0) return;

    const currentUrl = details.url;
    if (!currentUrl.startsWith('http')) return;

    for (const rule of rules) {
        try {
            const regex = new RegExp(rule.domainPattern, 'i');
            if (regex.test(currentUrl)) {
                const targetUri = rule.uriTemplate.replace('$URL', currentUrl);
                
                // Wir führen ein kurzes Delay ein, falls die Engine auf iOS 
                // Zeit braucht, um den Navigations-State zu klären
                chrome.tabs.update(details.tabId, { url: targetUri });
                break;
            }
        } catch (e) {
            console.error("AppLink Regex Error:", e);
        }
    }
});

