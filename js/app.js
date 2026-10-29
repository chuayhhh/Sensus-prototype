// Shared page routing and browser-session prototype state.
const route = {
    'Your Space': 'index.html',
    'Talk to Sensus': 'pages/chat.html',
    'Mood & Insights': 'pages/mood.html',
    'My Journal': 'pages/journal.html',
    'Wellness Toolkit': 'pages/toolkit.html',
    'Find Support': 'pages/support.html',
    'Settings': 'pages/settings.html',
    'Professional Portal': 'pages/professional.html',
    'Authentication & Onboarding': 'pages/onboarding.html',
    'All Screens': 'pages/all-screens.html'
};

function saveState() {
    try {
        sessionStorage.setItem('sensusState', JSON.stringify({
            mood,
            lang,
            memory,
            chat,
            entries,
            journal,
            savedMemory,
            consent,
            exercise,
            step
        }));
    } catch (e) {}
}

function loadState() {
    try {
        const state = JSON.parse(sessionStorage.getItem('sensusState') || '{}');
        if (state.mood !== undefined) mood = state.mood;
        if (state.lang !== undefined) lang = state.lang;
        if (state.memory !== undefined) memory = state.memory;
        if (state.chat !== undefined) chat = state.chat;
        if (state.entries !== undefined) entries = state.entries;
        if (state.journal !== undefined) journal = state.journal;
        if (state.savedMemory !== undefined) savedMemory = state.savedMemory;
        if (state.consent !== undefined) consent = state.consent;
        if (state.exercise !== undefined) exercise = state.exercise;
        if (state.step !== undefined) step = state.step;
    } catch (e) {}
}


const modules = ['Your Space', 'Talk to Sensus', 'Mood & Insights', 'My Journal', 'Wellness Toolkit', 'Find Support', 'Settings', 'Professional Portal', 'Authentication & Onboarding', 'All Screens'];
let page = document.body.dataset.page || 'Your Space',
    mood = 'Okay',
    lang = 'English',
    memory = false,
    chat = [
        ['ai', 'Hi, I’m Sensus. I’m here to listen. What’s on your mind?']
    ],
    entries = [],
    journal = [],
    savedMemory = [],
    consent = false,
    exercise = '4-6 breathing',
    step = 0;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
} [c]));
const card = (x, cl = '') => `<section class="card ${cl}">${x}</section>`;
const btn = (t, fn, cl = '') => `<button class="${cl}" onclick="${fn}">${t}</button>`;
const tools = ['60-second reset', 'Untangle a thought', 'Name what you need'];

function go(p) {
    saveState();
    const target = route[p] || 'index.html';
    // data-base is './' for index.html and '../' for pages/*.html.
    const projectRoot = new URL(document.body.dataset.base || './', window.location.href);
    window.location.href = new URL(target, projectRoot).href;
}

function render() {
    saveState();
    $('#title').textContent = page;
    $('#nav').innerHTML = modules.map(x => `<button class="${x===page?'active':''}" onclick="go('${x}')">${x}</button>`).join('');
    const a = $('#app');
    let html = '';
    if (page === 'Your Space') html = `<div class="grid"><div class="stack">${card(`<div class="hero" style="border-radius:18px;padding:20px"><b style="color:var(--green)">A little space, just for you ✨</b><h1>You don’t have to carry everything alone.</h1><p>Take a breath, check in with yourself, or talk through what’s on your mind.</p></div>`)}${card(`<h2>How are you feeling right now?</h2><p>No right answer — choose what feels closest.</p><div class="moods">${['Struggling','Low','Okay','Good','Great'].map((x,i)=>`<div class="mood ${mood===x?'selected':''}" onclick="mood='${x}';render()"><b>${['😣','😕','😐','🙂','🌤️'][i]}</b>${x}</div>`).join('')}</div><p>${btn('Save check-in','saveMood()')}</p>`)}${card(`<h3>What’s been taking up space in your mind?</h3><div class="inputrow"><input id="homeMsg" placeholder="You can start wherever feels easiest">${btn('Start chatting ↗','startHomeChat()')}</div>`)}<h3>A small step for right now</h3><div class="tiles">${tools.map((t,i)=>`<div class="tile" onclick="openTool(${i})"><h3>${t}</h3><p>${['Slow your breathing with a visual guide.','Look at a worry with more distance.','Make the next step clearer.'][i]}</p></div>`).join('')}</div><div class="stack">${card(`<div class="note">☀️ YOUR DAILY PAUSE</div><h2>“What would make today feel 5% lighter?”</h2>${btn('Reflect with Sensus →',"go('My Journal')",'soft')}`)}${card(`<h3>♧ Your space is private</h3><p>Control what you share and review your data settings.</p>${btn('Privacy controls',"go('Settings')",'alt')}`)}${card(`<h3>Urgent help in Singapore</h3><p>If you may hurt yourself or feel unsafe, contact a person now.</p><strong>SOS: 1767 · Emergency: 995</strong><p>${btn('View support resources',"go('Find Support')",'alt')}</p>`,'crisis')}</div></div>`;
    if (page === 'Talk to Sensus') html = `<div class="grid"><div class="stack">${card(`<div class="row between"><h2>Talk to Sensus</h2>${btn('New conversation','chat=[["ai","What would you like to talk about?"]];render()','alt')}</div><div class="chat" id="chatbox">${chat.map(([r,t])=>`<div class="bubble ${r==='me'?'me':''}">${esc(t)}</div>`).join('')}</div><p class="muted">Prototype responses are scripted. This is not an AI or crisis intervention service.</p><div class="inputrow"><input id="msg" placeholder="What’s on your mind?" onkeydown="if(event.key==='Enter')send()">${btn('Send →','send()')}</div><p>${btn('Save a preference',"memoryPrompt()",'soft')} ${btn('Conversation history',"alert('Prototype: previous conversations would appear here.')",'alt')} ${btn('End conversation',"go('Your Space')",'alt')}</p>`)} </div><div class="stack">${card(`<h3>Quick check-in</h3><p>How intense does the overwhelm feel?</p><div class="row">${[1,2,3,4,5].map(n=>btn(n,`this.classList.toggle('soft')`,'alt')).join('')}</div>`)}${card(`<h3>Try this together</h3><p>Small tools matched to this conversation.</p>${tools.map((t,i)=>`<p>${btn(t,`openTool(${i})`,'soft')}</p>`).join('')}`)}${card(`<h3>Need immediate support?</h3><p>Sensus cannot provide emergency care.</p>${btn('Urgent help',"go('Find Support')")}`,'crisis')}</div></div>`;
    if (page === 'Mood & Insights') html = `<h1>Mood & Insights</h1><div class="two">${card(`<h2>Daily check-in</h2><div class="moods">${['Struggling','Low','Okay','Good','Great'].map((x,i)=>`<div class="mood ${mood===x?'selected':''}" onclick="mood='${x}';render()"><b>${['😣','😕','😐','🙂','🌤️'][i]}</b>${x}</div>`).join('')}</div><p>${btn('Save mood','saveMood()')}</p>`)}${card(`<h2>Self-reported mood</h2><div class="bars">${[48,72,60,90,55,78,67].map(x=>`<i style="height:${x}%"></i>`).join('')}</div><small>Illustrative chart — replace with actual saved entries.</small>`)}${card(`<h2>Your check-ins</h2>${entries.length?entries.map(x=>`<p>${esc(x)}</p>`).join(''):'<p>No check-ins yet.</p>'}`)}${card(`<h2>AI-derived sentiment</h2><p>Separate from your own mood ratings. Not a diagnosis.</p><div class="note">No analysed messages available in this prototype.</div>`)}</div>`;
    if (page === 'My Journal') html = `<h1>My Journal</h1><div class="two">${card(`<h2>Write privately</h2><p>What would make today feel 5% lighter?</p><textarea id="journal" placeholder="Start writing..."></textarea><p>${btn('Save sample entry','saveJournal()')}</p><small>Stored in this browser session only.</small>`)}${card(`<h2>Recent reflections</h2>${journal.length?journal.map((x,i)=>`<div class="note"><p>${esc(x)}</p>${btn('Delete',`journal.splice(${i},1);render()`,'alt')}</div>`).join('<br>'):'<p>Your journal is empty.</p>'}`)}</div>`;
    if (page === 'Wellness Toolkit') html = `<h1>Wellness Toolkit</h1>${card(`<h2>${esc(exercise)}</h2><p>${exercise==='4-6 breathing'?'Breathe in gently for four counts, then breathe out for six. Stop if uncomfortable.':exercise==='5-4-3-2-1 grounding'?'Name five things you see, four you feel, three you hear, two you smell, and one you taste.':'Choose one manageable next step. You can skip any prompt.'}</p><div class="note">Step ${step+1} of 3 · Self-guided exercise</div><p>${btn('Next step','step=(step+1)%3;render()')} ${btn('Finish',"step=0;alert('You can return to this exercise anytime.');go('Your Space')",'alt')}</p>`)}<h2 style="margin-top:25px">Explore exercises</h2><div class="tiles">${['4-6 breathing','5-4-3-2-1 grounding','Make a tiny plan','Untangle a thought','Name what you need','60-second reset'].map(t=>`<div class="tile" onclick="exercise='${t}';step=0;render()"><h3>${t}</h3><p>Open guided activity →</p></div>`).join('')}</div>`;
    if (page === 'Find Support') html = `<h1>Find Support</h1>${card(`<h2>Singapore support resources</h2><p>Check official sources before using contact details; this prototype cannot verify live hours or availability.</p><div class="two">${[['Samaritans of Singapore','1767'],['National mindline','1771'],['Emergency ambulance','995'],['Mental health service directory','External handoff']].map(([x,y])=>`<div class="note"><h3>${x}</h3><strong>${y}</strong><p>${btn('View details',`alert('Prototype: verify service eligibility, language and current contact details before referral.')`,'alt')}</p></div>`).join('')}</div>`)}<p></p>${card(`<h2>Referral request — prototype</h2><p>Only share information with a professional after explicit informed consent and a real service partnership.</p><label><input type="checkbox" id="refConsent"> I understand this is a demonstration and no referral will be sent.</label><p>${btn('Preview referral flow',"if($('#refConsent').checked)alert('Referral preview only. No data sent.');else alert('Please review the consent checkbox.')")}</p>`)}`;
    if (page === 'Settings') html = `<h1>Settings & Privacy</h1><div class="two">${card(`<h2>Language</h2><select onchange="lang=this.value">${['English','中文','Bahasa Melayu','தமிழ்'].map(x=>`<option ${lang===x?'selected':''}>${x}</option>`).join('')}</select><p>Language selection is a prototype preference; translations and multilingual AI are not implemented here.</p>`)}${card(`<h2>AI memory</h2><label><input type="checkbox" ${memory?'checked':''} onchange="memory=this.checked"> Allow optional long-term memories</label><p>${savedMemory.length?savedMemory.map(x=>`<div class="note">${esc(x)}</div>`).join(''):'No memories saved.'}</p>${btn('Clear memories','savedMemory=[];render()','alt')}`)}${card(`<h2>Privacy and data</h2><p>Consent, retention, access and deletion require backend implementation and testing.</p>${btn('Clear prototype data','entries=[];journal=[];savedMemory=[];chat=[];render()','alt')}`)}${card(`<h2>Account</h2><p>Authentication, profile changes, data export and deletion are mapped but not connected.</p>${btn('See authentication flow',"go('Authentication & Onboarding')",'soft')}`)}</div>`;
    if (page === 'Professional Portal') html = `<h1>Professional Portal <span class="pill">Simulated data</span></h1>${card(`<h2>Case overview</h2><p>Access to real cases would require verified professional accounts, consent, legal basis and audit logging.</p><div class="two">${['CASE-DEMO-001 · Awaiting review','CASE-DEMO-002 · Follow-up pending','CASE-DEMO-003 · Resolved'].map(x=>`<div class="note"><h3>${x}</h3><p>Entirely synthetic case. No user data.</p>${btn('Open simulated case',"alert('Synthetic case details: authorised status updates and resolution notes would be recorded here.')",'alt')}</div>`).join('')}</div>`)}`;
    if (page === 'Authentication & Onboarding') html = `<h1>Authentication & Onboarding</h1><div class="two">${card(`<h2>Create account</h2><p><input placeholder="Email address" type="email"></p><p><input placeholder="Password" type="password"></p>${btn('Continue (demo)',"alert('Authentication not connected. Next: onboarding and consent.')")}`)}${card(`<h2>Welcome to Sensus</h2><p>Choose language, support style and optional memory consent.</p><p>${btn('Choose language',"go('Settings')",'soft')}</p><p>${btn('Continue to Your Space',"go('Your Space')")}</p>`)}${card(`<h2>Privacy first</h2><p>Sensus is not a replacement for professional care. Choose what data is saved and why.</p>`)}${card(`<h2>Recovery & errors</h2><p>Forgot password, reset password, session expiry and validation errors should be built in production.</p>`)}</div>`;
    if (page === 'All Screens') {
        let s = {
            'Authentication': ['Landing', 'Sign Up', 'Sign In', 'Forgot Password', 'Reset Password', 'Privacy Consent', 'Auth Error'],
            'Onboarding': ['Welcome', 'Language', 'Preferences', 'Support Style', 'Memory Consent', 'Complete'],
            'Your Space': ['First Visit', 'Returning Dashboard', 'Mood Selected', 'Daily Reflection', 'Personalised Dashboard'],
            'AI Companion': ['New Chat', 'Active Chat', 'History', 'Search', 'Tools', 'Intensity', 'Memory Permission', 'Memory Overview', 'Feedback', 'End', 'Crisis', 'Error'],
            'Mood & Insights': ['Overview', 'Check-In', 'Complete', 'Calendar', 'Weekly', 'Monthly', 'AI Sentiment', 'Entry Detail'],
            'Journal': ['Overview', 'New', 'Guided', 'Details', 'Delete'],
            'Toolkit': ['Library', 'Breathing', 'Active', 'Grounding', 'Reflection', 'Planning', 'Complete', 'Saved'],
            'Support': ['Directory', 'Filters', 'Details', 'Referral', 'Consent', 'Confirmation', 'Crisis Resources'],
            'Crisis': ['Overlay', 'Urgent Help', 'Consent', 'Confirmation', 'Unavailable'],
            'Professional': ['Login', 'Dashboard', 'Cases', 'Details', 'Follow-up', 'Referrals', 'Audit'],
            'Settings': ['Profile', 'Security', 'Language', 'Preferences', 'Memory', 'Privacy', 'Export', 'Delete', 'Accessibility']
        };
        html = '<h1>Full screen inventory</h1><p>79 planned primary frames. This prototype implements representative connected flows and previews; it is not 79 fully realised production screens.</p>' + Object.entries(s).map(([k, v]) => card(`<h2>${k} (${v.length})</h2><div class="screenlist">${v.map(x=>`<span class="pill">${x}</span>`).join('')}</div>`)).join('<p></p>')
    }
    a.innerHTML = html;
    const cb = $('#chatbox');
    if (cb) cb.scrollTop = cb.scrollHeight;
}

function saveMood() {
    entries.unshift(`${new Date().toLocaleDateString()} — ${mood}`);
    go('Mood & Insights')
}

function startHomeChat() {
    let v = $('#homeMsg').value.trim();
    if (v) {
        chat.push(['me', v]);
        respond(v)
    }
    go('Talk to Sensus')
}

function send() {
    let v = $('#msg').value.trim();
    if (!v) return;
    chat.push(['me', v]);
    respond(v);
    render()
}

function respond(v) {
    let risk = /suicid|kill myself|hurt myself|end my life/i.test(v);
    chat.push(['ai', risk ? 'I’m sorry you’re facing this. If you may be in immediate danger, contact emergency services or someone you trust now. In Singapore, SOS is 1767 and emergency ambulance is 995. This demo cannot monitor or send help.' : 'Thanks for sharing that. Would it help to talk a little more about what feels hardest, or try a short grounding exercise? (Scripted prototype response.)'])
}

function saveJournal() {
    let v = $('#journal').value.trim();
    if (v) {
        journal.unshift(v);
        render()
    }
}

function openTool(i) {
    exercise = ['4-6 breathing', 'Untangle a thought', 'Make a tiny plan'][i];
    step = 0;
    go('Wellness Toolkit')
}

function memoryPrompt() {
    if (!memory) {
        alert('Turn on optional AI memory in Settings first.');
        return
    }
    let x = prompt('What preference would you like Sensus to remember?');
    if (x) {
        savedMemory.push(x);
        render()
    }
}
loadState();
render();