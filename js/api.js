const api = async (p) => {
    if (API_URL.includes("PLACEHOLDER")) { 
        alert("API URL Missing! (Nếu bạn đang test local, hãy thay PLACEHOLDER bằng URL Script của bạn)"); 
        return { success: false }; 
    }
    app.toggleLoading(true); 
    p.lang = state.lang;
    
    // Gắn token (là email trước đây) vào mọi request nếu có
    if (state.user) {
        p.email = state.user; 
        p.owner = state.user; 
    }
    
    try { 
        const r = await fetch(API_URL, { method: 'POST', body: JSON.stringify(p) }); 
        return await r.json(); 
    } catch (e) { 
        alert("Error: " + e); return { success: false }; 
    } finally { 
        app.toggleLoading(false); 
    }
};

const gemini = {
    getKey: () => apiKey || localStorage.getItem('ls_gemini_key'),
    call: async (prompt) => {
        const key = gemini.getKey();
        if (!key) {
            settings.open();
            throw new Error("Please enter your Gemini API Key in Settings.");
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            throw e;
        }
    },
    enhance: async () => {
        const content = document.getElementById('textContent').value;
        if (!content.trim()) return alert("Please enter some content first.");
        const isCode = editor.isCodeMode['create'];
        app.toggleLoading(true);
        const prompt = isCode 
            ? `Review this code, fix bugs, format it, and improve logic if needed. Output ONLY the code:\n\n${content}`
            : `Proofread and improve this text for clarity and professionalism. Output ONLY the improved text:\n\n${content}`;
        try {
            const result = await gemini.call(prompt);
            gemini.showResult(result, true);
        } catch (e) {
            alert("AI Error: " + e.message);
        } finally {
            app.toggleLoading(false);
        }
    },
    explain: async () => {
        const content = state.originalContent;
        const isCode = editor.isCodeMode['view'];
        const type = isCode ? 'code' : 'text';
        app.toggleLoading(true);
        const prompt = `Explain the following ${type} concisely and clearly:\n\n${content}`;
        try {
            const result = await gemini.call(prompt);
            gemini.showResult(result, false);
        } catch (e) {
            alert("AI Error: " + e.message);
        } finally {
            app.toggleLoading(false);
        }
    },
    showResult: (text, allowApply) => {
        const modal = document.getElementById('modalAI');
        const contentDiv = document.getElementById('aiResultContent');
        const btnApply = document.getElementById('btnApplyAI');
        contentDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(text) : text.replace(/\n/g, '<br>');
        if (allowApply) {
            btnApply.style.display = 'block';
            btnApply.onclick = () => {
                document.getElementById('textContent').value = text;
                document.getElementById('textContent').dispatchEvent(new Event('input'));
                modal.classList.add('hidden');
            };
        } else {
            btnApply.style.display = 'none';
        }
        modal.classList.remove('hidden');
    }
};
