async function loadLyricsList() {
    try {
        const r = await fetch('data/lyrics_list.json');
        lyricsList = await r.json();
    } catch(e) {}
}

function normalizeStr(s) { return s.trim().replace(/\s+/g, ' '); }

function findLyricsFile(a, t) {
    const na = normalizeStr(a), nt = normalizeStr(t);
    const f = lyricsList.find(l => normalizeStr(l.artist) === na && normalizeStr(l.title) === nt);
    return f ? f.file : null;
}

async function fetchSheet(s) {
    const r = await fetch(`https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=0&sheet=${encodeURIComponent(s)}`);
    const t = await r.text();
    const j = JSON.parse(t.substring(47, t.length-2));
    return j.table.rows.map(row => row.c);
}

function extractYoutubeId(url) {
    if (!url) return null;
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return m ? m[1] : null;
}

async function selectCategory(n, el) {
    document.querySelectorAll('.tab-group .tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('list').innerHTML = '<div class="list-loading"></div>';
    const rows = await fetchSheet(n);
    currentSongs = rows.slice(1).map(r => {
        if (!r || !r[0] || !r[1]) return null;
        let ml = '';
        if (r[5] && String(r[5].v||'').startsWith('http')) ml = String(r[5].v);
        else if (r[6] && String(r[6].v||'').startsWith('http')) ml = String(r[6].v);
        return {
            artist: String(r[0].v||''),
            title: String(r[1].v||''),
            key: r[2] ? String(r[2].v||'') : '',
            keyUp: r[3] ? String(r[3].v||'') : '',
            note: r[4] ? String(r[4].v||'') : '',
            mr: ml,
            lyricsFile: findLyricsFile(String(r[0].v||''), String(r[1].v||'')),
            filterArtist: String(r[0].v||'').split('(')[0].trim()
        };
    }).filter(s => s !== null);
    currentArtist = '전체';
    renderArtistFilter();
    renderSongList();
    document.getElementById('list').scrollTop = 0;
}

function selectAndScrollArtist(a) {
    if (currentArtist === a) { currentArtist = '전체'; } else { currentArtist = a; }
    renderArtistFilter();
    renderSongList();
    const target = document.getElementById('art-btn-' + a);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderArtistFilter() {
    const m = {};
    currentSongs.forEach(s => { m[s.filterArtist] = (m[s.filterArtist] || 0) + 1; });
    const sorted = Object.keys(m).sort((a,b) => m[b] - m[a]);
    const el = document.getElementById('artistList');
    el.innerHTML = '';
    const all = document.createElement('div');
    all.className = 'tab' + (currentArtist === '전체' ? ' active' : '');
    all.textContent = 'ALL';
    all.onclick = () => { currentArtist = '전체'; renderArtistFilter(); renderSongList(); if(window.innerWidth <= 768) toggleSidebar(); };
    el.appendChild(all);
    sorted.forEach(a => {
        const b = document.createElement('div');
        b.className = 'tab' + (currentArtist === a ? ' active' : '');
        b.textContent = a;
        b.id = 'art-btn-' + a;
        b.onclick = () => { selectAndScrollArtist(a); if(window.innerWidth <= 768) toggleSidebar(); };
        el.appendChild(b);
    });
}

function hl(text, q) {
    const safe = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    if (!q) return safe;
    return safe.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'), m => `<mark class="hl">${m}</mark>`);
}

function renderSongList() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const el = document.getElementById('list');
    el.innerHTML = '';
    const f = currentSongs.filter(s =>
        (currentArtist === '전체' || s.filterArtist === currentArtist) &&
        (s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
    );
    f.forEach(s => {
        const d = document.createElement('div');
        d.className = 'song';
        const tags = `<div class="song-info-tags">${s.note ? `<span class="note-text">${s.note}</span>` : ''}${s.key ? `<span class="key-badge">${s.key}</span>` : ''}${s.keyUp ? `<span class="keyup-badge">${s.keyUp}</span>` : ''}</div>`;
        const ytId = extractYoutubeId(s.mr);
        const lf = s.lyricsFile || '';
        let mb = s.mr
            ? `<a class="mr-btn" href="${s.mr}" target="_blank" onclick="sendToWidget('${s.title.replace(/'/g,"\\'")}','${s.artist.replace(/'/g,"\\'")}','${lf}','${ytId||''}')">MR</a>`
            : `<a class="mr-btn find" href="https://www.youtube.com/results?search_query=${encodeURIComponent(s.title+' '+s.artist+' MR')}" target="_blank">MR 찾기</a>`;
        d.innerHTML = `<div class="copy-icon" onclick="copyText('${s.artist} - ${s.title}', this)">COPY</div><div class="artist-name">${hl(s.artist,q)}</div><div class="song-title">${hl(s.title,q)}</div>${tags}${mb}<span class="lyrics-btn ${s.lyricsFile?'active':''}" onclick="showLyrics('${s.lyricsFile}')">LYRICS</span>`;
        el.appendChild(d);
    });
}

function sendToWidget(title, artist, lyricsFile, youtubeId) {
    db.ref('currentSong').set({
        title: title,
        artist: artist,
        timestamp: Date.now(),
        lyricsFile: lyricsFile || null,
        youtubeId: youtubeId || null
    });
}

function showLyrics(f) {
    if (!f || f === 'null') return;
    fetch(`data/lyrics/${f}`).then(r => r.text()).then(t => {
        document.getElementById('lyricsText').textContent = t;
        document.getElementById('lyricsModal').style.display = 'flex';
        document.querySelector('.lyrics-body').scrollTop = 0;
        resetDrag();
    });
}

function copyText(t, b) {
    navigator.clipboard.writeText(t).then(() => {
        b.textContent = 'Copied';
        b.classList.add('copied');
        setTimeout(() => { b.textContent = 'COPY'; b.classList.remove('copied'); }, 1200);
    });
}

function remoteReload() {
    db.ref('currentSong').remove();
    db.ref('command').set({ type: 'RELOAD', timestamp: Date.now() });
}
