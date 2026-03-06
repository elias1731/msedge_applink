document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Check OS for warning banner
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (!isIOS) {
        document.getElementById('os-warning').style.display = 'block';
    }

    // Load initial state
    chrome.storage.sync.get(['appLinkSettings'], (data) => {
        const settings = data.appLinkSettings || { spotify: 'off', youtube: 'off', ytmusic: 'off' };
        
        checkboxes.forEach(box => {
            const service = box.dataset.service;
            const mode = box.dataset.mode;
            box.checked = (settings[service] === mode);
        });
    });

    // Handle toggle logic
    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            const service = e.target.dataset.service;
            const mode = e.target.dataset.mode;
            const isChecked = e.target.checked;

            chrome.storage.sync.get(['appLinkSettings'], (data) => {
                let settings = data.appLinkSettings || { spotify: 'off', youtube: 'off', ytmusic: 'off' };

                if (isChecked) {
                    settings[service] = mode;
                    const otherMode = mode === 'app' ? 'livecontainer' : 'app';
                    const otherBoxId = (otherMode === 'app' ? 'app_' : 'lc_') + service;
                    document.getElementById(otherBoxId).checked = false;
                } else {
                    settings[service] = 'off';
                }

                chrome.storage.sync.set({ appLinkSettings: settings });
            });
        });
    });
});\n