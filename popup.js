const list = document.getElementById('list');
const btnAdd = document.getElementById('add');
const inputDomain = document.getElementById('domain');
const inputUri = document.getElementById('uri');

// Baut die Liste im Popup auf
function renderRules(rules) {
    list.innerHTML = '';
    
    if (rules.length === 0) {
        list.innerHTML = '<span class="hint">Keine Umleitungen aktiv.</span>';
        return;
    }

    rules.forEach((rule, index) => {
        const div = document.createElement('div');
        div.className = 'rule';
        
        const info = document.createElement('div');
        info.className = 'rule-info';
        info.innerHTML = `<strong>${rule.domainPattern}</strong><br/>&rarr; ${rule.uriTemplate}`;
        
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Löschen';
        // Event-Listener direkt anheften
        delBtn.onclick = () => deleteRule(index);

        div.appendChild(info);
        div.appendChild(delBtn);
        list.appendChild(div);
    });
}

// Lädt die Regeln aus dem Chrome Sync-Speicher
function loadRules() {
    chrome.storage.sync.get(['appLinkRules'], (data) => {
        renderRules(data.appLinkRules || []);
    });
}

// Löscht eine bestimmte Regel
function deleteRule(index) {
    chrome.storage.sync.get(['appLinkRules'], (data) => {
        const rules = data.appLinkRules || [];
        rules.splice(index, 1);
        chrome.storage.sync.set({ appLinkRules: rules }, loadRules);
    });
}

// Fügt eine neue Regel hinzu
btnAdd.addEventListener('click', () => {
    const domainPattern = inputDomain.value.trim();
    const uriTemplate = inputUri.value.trim();
    
    if (!domainPattern || !uriTemplate) return;

    chrome.storage.sync.get(['appLinkRules'], (data) => {
        const rules = data.appLinkRules || [];
        rules.push({ domainPattern, uriTemplate });
        
        chrome.storage.sync.set({ appLinkRules: rules }, () => {
            inputDomain.value = '';
            inputUri.value = '';
            loadRules();
        });
    });
});

// Initiales Laden
document.addEventListener('DOMContentLoaded', loadRules);

