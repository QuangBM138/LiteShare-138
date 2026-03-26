const theme = {
    init: () => {
        const t = localStorage.getItem('ls_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', t);
    },
    toggle: () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('ls_theme', next);
    }
};

const settings = {
    open: () => {
        document.getElementById('modalSettings').classList.remove('hidden');
        document.getElementById('inputApiKey').value = localStorage.getItem('ls_gemini_key') || '';
    },
    save: () => {
        const key = document.getElementById('inputApiKey').value.trim();
        if(key) localStorage.setItem('ls_gemini_key', key);
        else localStorage.removeItem('ls_gemini_key');
        document.getElementById('modalSettings').classList.add('hidden');
        alert("Settings Saved!");
    }
};

const editor = {
    isCodeMode: { create: false, view: false },
    init: () => {
        editor.attachEvents('textContent', 'createLineNumbers', 'charCounter');
        editor.attachEvents('editContent', 'editLineNumbers');
        editor.attachEvents('viewContent', 'viewLineNumbers', null, true);
    },
    attachEvents: (txtId, lineId, counterId, isDiv = false) => {
        const txt = document.getElementById(txtId);
        const lines = document.getElementById(lineId);
        const counter = counterId ? document.getElementById(counterId) : null;
        
        if (!isDiv) {
            const updateAll = () => {
                editor.updateLines(txt, lines);
                if (counter) editor.updateCounter(txt, counter);
            };
            txt.addEventListener('input', updateAll);
            txt.addEventListener('scroll', () => lines.scrollTop = txt.scrollTop);
            txt.addEventListener('keydown', (e) => {
                if (e.key == 'Tab') { e.preventDefault(); const s = txt.selectionStart; txt.value = txt.value.substring(0,s) + "  " + txt.value.substring(txt.selectionEnd); txt.selectionStart = txt.selectionEnd = s+2; updateAll(); }
            });
        }
    },
    updateLines: (ele, lineEle) => {
        const val = ele.value || ele.innerText || "";
        const count = val.split('\n').length;
        lineEle.innerHTML = Array(count).fill(0).map((_, i) => `<div>${i + 1}</div>`).join('');
    },
    updateCounter: (ele, counterEle) => {
        const len = ele.value.length;
        counterEle.innerText = `${len} / ${MAX_CHARS}`;
        if (len > MAX_CHARS) counterEle.classList.add('limit-reached');
        else counterEle.classList.remove('limit-reached');
    },
    toggleMode: (ctx) => {
        const wrapper = document.getElementById(ctx + 'EditorWrapper');
        const btn = document.getElementById(ctx === 'create' ? 'btnToggleEditorCreate' : 'btnToggleEditorView');
        editor.isCodeMode[ctx] = !editor.isCodeMode[ctx];
        if (editor.isCodeMode[ctx]) {
            wrapper.classList.add('code-mode');
            btn.style.background = 'var(--surface-2)'; btn.style.color = 'var(--primary)';
        } else {
            wrapper.classList.remove('code-mode');
            btn.style.background = 'transparent'; btn.style.color = 'var(--text)';
        }
        if (ctx === 'create') editor.updateLines(document.getElementById('textContent'), document.getElementById('createLineNumbers'));
        else if (ctx === 'view') {
            if (!document.getElementById('editEditorWrapper').classList.contains('hidden')) editor.updateLines(document.getElementById('editContent'), document.getElementById('editLineNumbers'));
            else editor.updateLines(document.getElementById('viewContent'), document.getElementById('viewLineNumbers'));
        }
    }
};
