document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Lade aktuellen Status
    chrome.storage.sync.get(['appLinkSettings'], (data) => {
        const settings = data.appLinkSettings || { spotify: 'off', youtube: 'off', ytmusic: 'off' };
        
        checkboxes.forEach(box => {
            const service = box.dataset.service;
            const mode = box.dataset.mode;
            // Haken setzen, wenn die Einstellung mit dem Modus übereinstimmt
            box.checked = (settings[service] === mode);
        });
    });

    // Event Listener für Klicks auf die Schalter
    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            const service = e.target.dataset.service;
            const mode = e.target.dataset.mode;
            const isChecked = e.target.checked;

            chrome.storage.sync.get(['appLinkSettings'], (data) => {
                let settings = data.appLinkSettings || { spotify: 'off', youtube: 'off', ytmusic: 'off' };

                if (isChecked) {
                    // Setze den neuen Modus (app oder livecontainer)
                    settings[service] = mode;
                    
                    // Schalte den jeweils anderen Schalter für den selben Dienst AUS
                    const otherMode = mode === 'app' ? 'livecontainer' : 'app';
                    const otherBoxId = (otherMode === 'app' ? 'app_' : 'lc_') + service;
                    document.getElementById(otherBoxId).checked = false;
                } else {
                    // Wenn der Schalter deaktiviert wurde, ist der Service komplett "off"
                    settings[service] = 'off';
                }

                // Speichern
                chrome.storage.sync.set({ appLinkSettings: settings });
            });
        });
    });
});