const app = {
    init: () => { 
        theme.init();
        document.getElementById('langSelect').value = state.lang; 
        app.applyLang(); 
        editor.init();
        const p = new URLSearchParams(window.location.search); 
        const id = p.get('id'); 
        if (id) viewer.load(id); else app.resetCreate();
        app.updateUserUI();
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('userDropdown');
            const btn = document.getElementById('btnUser');
            if (!dropdown.classList.contains('hidden') && !btn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    },
    setLang: (l) => { state.lang = l; localStorage.setItem('ls_lang', l); app.applyLang(); },
    applyLang: () => { const t = TRANSLATIONS[state.lang]; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if (t[k]) el.innerText = t[k]; }); },
    t: (k) => TRANSLATIONS[state.lang][k] || k,
    
    updateUserUI: () => { 
        const btnUser = document.getElementById('btnUser');
        const authOptions = document.querySelectorAll('.auth-required');

        if (state.user) {
            btnUser.style.color = 'var(--success)'; btnUser.style.borderColor = 'var(--success)';
            authOptions.forEach(opt => {
                opt.style.display = ''; opt.disabled = false; opt.hidden = false;
            });
        } else {
            btnUser.style.color = 'var(--text)'; btnUser.style.borderColor = 'var(--border)';
            document.getElementById('userDropdown').classList.add('hidden');
            authOptions.forEach(opt => {
                opt.style.display = 'none'; opt.disabled = true; opt.hidden = true;
            });
            
            const durationSelect = document.getElementById('shareDuration');
            if (durationSelect.value === '52560000' || durationSelect.value === 'custom') {
                durationSelect.value = '10';
                app.handleDurationChange('10');
            }
        }
    },
    toggleUserMenu: (e) => {
        if (!state.user) app.showAuth();
        else {
            const dropdown = document.getElementById('userDropdown');
            dropdown.classList.toggle('hidden');
            e.stopPropagation();
        }
    },
    hideAll: () => document.querySelectorAll('.view-container').forEach(el => el.classList.add('hidden')),
    goHome: () => { try { window.history.pushState({}, document.title, window.location.pathname); } catch (e) {} app.resetCreate(); },
    showAuth: () => { app.hideAll(); document.getElementById('view-auth').classList.remove('hidden'); document.getElementById('inputEmail').focus(); },
    showDashboard: () => { app.hideAll(); document.getElementById('view-dashboard').classList.remove('hidden'); document.getElementById('userDropdown').classList.add('hidden'); dashboard.load(); },
    resetCreate: () => { 
        try { window.history.pushState({}, document.title, window.location.pathname); } catch (e) {} 
        app.hideAll(); document.getElementById('view-create').classList.remove('hidden'); 
        document.getElementById('textContent').value = ''; 
        document.getElementById('shareDuration').value = '10';
        document.getElementById('customDateInput').value = '';
        document.getElementById('customDateContainer').classList.add('hidden');
        document.getElementById('createLineNumbers').innerHTML = '1'; 
        document.getElementById('charCounter').innerText = `0 / ${MAX_CHARS}`;
        document.getElementById('charCounter').classList.remove('limit-reached');
        document.getElementById('modalExpired').classList.add('hidden'); 
        const wrapper = document.getElementById('createEditorWrapper');
        const btn = document.getElementById('btnToggleEditorCreate');
        wrapper.classList.remove('code-mode');
        btn.style.background = 'transparent'; btn.style.color = 'var(--text)';
        editor.isCodeMode['create'] = false;
        document.getElementById('textContent').focus(); 
    },
    handleDurationChange: (val) => {
        const container = document.getElementById('customDateContainer');
        const dateInput = document.getElementById('customDateInput');
        if (val === 'custom') {
            container.classList.remove('hidden');
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            dateInput.min = now.toISOString().slice(0,16);
        } else {
            container.classList.add('hidden');
        }
    },
    showResult: () => { app.hideAll(); document.getElementById('view-result').classList.remove('hidden'); },
    showViewer: () => { app.hideAll(); document.getElementById('view-viewer').classList.remove('hidden'); },
    toggleLoading: (show) => document.getElementById('loading').classList.toggle('hidden', !show)
};

const auth = {
    sendOtp: async () => { const e = document.getElementById('inputEmail').value.trim(); if (!e) return; state.currentEmail = e; const r = await api({ action: 'sendOtp', email: e }); if (r.success) { document.getElementById('step-email').classList.add('hidden'); document.getElementById('step-otp').classList.remove('hidden'); } else alert(r.message); },
    verifyOtp: async () => { const o = document.getElementById('inputOtp').value.trim(); const r = await api({ action: 'verifyOtp', email: state.currentEmail, otp: o }); if (r.success) { state.user = r.token; localStorage.setItem('ls_user', state.user); app.updateUserUI(); app.showDashboard(); } else alert(r.message); },
    reset: () => { document.getElementById('step-email').classList.remove('hidden'); document.getElementById('step-otp').classList.add('hidden'); },
    logout: () => { localStorage.removeItem('ls_user'); state.user = null; app.updateUserUI(); app.resetCreate(); }
};

const sharing = {
    upload: async () => { 
        const c = document.getElementById('textContent').value; 
        if (!c.trim()) return alert(app.t('msgNoContent')); 
        
        if (c.length > MAX_CHARS) {
            document.getElementById('modalLimit').classList.remove('hidden');
            return;
        }

        let duration = document.getElementById('shareDuration').value;
        
        if (duration === 'custom') {
            const dateVal = document.getElementById('customDateInput').value;
            if (!dateVal) return alert(app.t('msgInvalidDate'));
            const targetDate = new Date(dateVal);
            const now = new Date();
            const diffMs = targetDate - now;
            if (diffMs <= 0) return alert(app.t('msgInvalidDate'));
            duration = Math.ceil(diffMs / 60000);
        }

        const r = await api({ action: 'upload', type: 'text', content: c, duration: duration }); 
        if (r.success) sharing.displayResult(r.id, r.expires); else alert(r.message); 
    },
    displayResult: (id, exp) => { const u = window.location.href.split('?')[0] + '?id=' + id; document.getElementById('shareLink').value = u; document.getElementById('expireDisplay').innerText = new Date(exp).toLocaleString(state.lang); document.getElementById('qrcode').innerHTML = ""; new QRCode(document.getElementById("qrcode"), { text: u, width: 128, height: 128 }); app.showResult(); },
    copyLink: () => { const c = document.getElementById("shareLink"); c.select(); navigator.clipboard.writeText(c.value); alert("Copied!"); }
};

const dashboard = {
    load: async () => { 
        if (!state.user) return; 
        const tb = document.querySelector('#historyTable tbody'); 
        tb.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px">${app.t('processing')}</td></tr>`; 
        const r = await api({ action: 'getHistory' }); 
        if (r.success) {
            if (r.history.length > 0) { 
                tb.innerHTML = "";
                r.history.forEach(i => { 
                    const isExp = new Date() > new Date(i.expires); 
                    const tr = document.createElement('tr'); 
                    tr.innerHTML = `<td><a href="?id=${i.id}" target="_blank" class="id-cell">${i.id.substring(0,6)}..</a></td><td>${i.type}</td><td>${new Date(i.expires).toLocaleDateString()}</td><td>${i.views}</td><td><span class="status-badge ${isExp ? 'status-expired' : 'status-active'}">${isExp ? 'Expired' : 'Active'}</span></td>`; 
                    tb.appendChild(tr); 
                }); 
            } else { tb.innerHTML = `<tr><td colspan='5' style='text-align:center;color:var(--text-dim);padding:30px'>${app.t('noData')}</td></tr>`; }
        } else { 
            tb.innerHTML = `<tr><td colspan='5' style='text-align:center;color:var(--danger);padding:30px'>${r.message}</td></tr>`; 
            if(r.message.includes('expired') || r.message.includes('hết hạn')) { auth.logout(); }
        }
    }
};

const viewer = {
    load: async (id) => { 
        app.showViewer(); state.currentShareId = id; document.getElementById('viewContent').innerHTML = ""; document.getElementById('ownerRenewSection').classList.add('hidden'); document.getElementById('btnEdit').classList.add('hidden');
        
        const wrapper = document.getElementById('viewEditorWrapper');
        const btn = document.getElementById('btnToggleEditorView');
        wrapper.classList.remove('code-mode');
        btn.style.background = 'transparent'; btn.style.color = 'var(--text)';
        editor.isCodeMode['view'] = false;

        const r = await api({ action: 'getData', id: id }); 
        if (r.success) { 
            state.originalContent = r.content; document.getElementById('viewMetaDate').innerText = `Created: ${new Date(r.created).toLocaleDateString()}`; viewer.renderContent(r.content); editor.updateLines(document.getElementById('viewContent'), document.getElementById('viewLineNumbers'));
            
            if (r.isExpired) { 
                if (r.owner !== 'guest' && !r.message) { 
                    document.getElementById('ownerRenewSection').classList.remove('hidden'); document.getElementById('viewOwnerBadge').classList.remove('hidden'); 
                } else {
                    document.getElementById('modalExpired').classList.remove('hidden'); 
                }
            } 
            else if (r.owner !== 'guest') { 
                document.getElementById('viewOwnerBadge').classList.remove('hidden'); document.getElementById('btnEdit').classList.remove('hidden'); 
            }
        } else document.getElementById('modalExpired').classList.remove('hidden');
    },
    renderContent: (t) => { document.getElementById('viewContent').innerText = t; },
    enableEdit: () => { 
        document.getElementById('viewEditorWrapper').classList.add('hidden'); document.getElementById('editEditorWrapper').classList.remove('hidden'); document.getElementById('editControls').classList.remove('hidden'); document.getElementById('btnEdit').classList.add('hidden'); const area = document.getElementById('editContent'); area.value = state.originalContent; 
        const editWrapper = document.getElementById('editEditorWrapper');
        if (editor.isCodeMode['view']) editWrapper.classList.add('code-mode'); else editWrapper.classList.remove('code-mode');
        editor.updateLines(area, document.getElementById('editLineNumbers')); area.focus(); 
    },
    cancelEdit: () => { document.getElementById('viewEditorWrapper').classList.remove('hidden'); document.getElementById('editEditorWrapper').classList.add('hidden'); document.getElementById('editControls').classList.add('hidden'); document.getElementById('btnEdit').classList.remove('hidden'); },
    saveEdit: async () => { const n = document.getElementById('editContent').value; const r = await api({ action: 'update', id: state.currentShareId, content: n }); if (r.success) { alert(app.t('msgUpdateSuccess')); state.originalContent = n; viewer.renderContent(n); viewer.cancelEdit(); } else alert(r.message); },
    
    renew: async () => {
        let dur = document.getElementById('renewDuration').value;
        if (dur === 'custom') {
            const dateVal = document.getElementById('renewCustomDateInput').value;
            if (!dateVal) return alert(app.t('msgInvalidDate'));
            const targetDate = new Date(dateVal);
            const now = new Date();
            const diffMs = targetDate - now;
            if (diffMs <= 0) return alert(app.t('msgInvalidDate'));
            dur = Math.ceil(diffMs / 60000);
        }
        const r = await api({ action: 'renew', id: state.currentShareId, duration: dur });
        if (r.success) { alert(app.t('msgRenewSuccess')); window.location.reload(); } else alert(r.message);
    },
    handleRenewChange: (val) => {
        const dateInput = document.getElementById('renewCustomDateInput');
        if (val === 'custom') {
            dateInput.classList.remove('hidden');
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            dateInput.min = now.toISOString().slice(0,16);
        } else {
            dateInput.classList.add('hidden');
        }
    }
};

// Gọi khởi tạo hệ thống
app.init();
