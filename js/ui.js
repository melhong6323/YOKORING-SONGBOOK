function showPage(p) {
    document.querySelectorAll('.page').forEach(pg => pg.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(ni => ni.classList.remove('active'));
    document.getElementById(p + '-page').classList.add('active');
    document.getElementById('btn-nav-' + p).classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
    document.querySelectorAll('.mobile-nav-item').forEach(mi => mi.classList.remove('active'));
    const mMi = document.getElementById('mbtn-' + p);
    if (mMi) mMi.classList.add('active');
    const qb = document.getElementById('mobileQuickSongbook');
    if (qb) qb.classList.toggle('hidden', p === 'songbook');
    document.body.classList.toggle('show-quick-banner', p !== 'songbook');
}

function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    const isOpen = menu.classList.toggle('open');
    overlay.classList.toggle('open', isOpen);
    document.body.classList.toggle('mobile-menu-open', isOpen);
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('mobileMenuOverlay').classList.remove('open');
    document.body.classList.remove('mobile-menu-open');
}

function closeM(id) { document.getElementById(id).style.display = 'none'; }

function loadYoutube(el, id) {
    el.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen style="width:100%; height:100%; border:none; border-radius:14px; position:absolute; top:0; left:0;"></iframe>`;
}

/* --- 드래그 로직 --- */
let isDragging = false, xOff = 0, yOff = 0, startX, startY;

function resetDrag() {
    xOff = 0; yOff = 0;
    document.getElementById('dragTarget').style.transform = `translate(-50%, -50%)`;
}

function dStart(e) {
    if (e.target.classList.contains('modal-close')) return;
    const cx = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    const cy = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    startX = cx - xOff; startY = cy - yOff;
    isDragging = true;
}

function dMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const cx = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    const cy = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    xOff = cx - startX; yOff = cy - startY;
    document.getElementById('dragTarget').style.transform = `translate(calc(-50% + ${xOff}px), calc(-50% + ${yOff}px))`;
}

/* --- 초기화 --- */
(async () => {
    await loadLyricsList();
    const tbs = document.getElementById('tabs');
    SHEET_NAMES.slice(1).forEach(n => {
        const tb = document.createElement('div');
        tb.className = 'tab';
        tb.textContent = n;
        tb.onclick = () => selectCategory(n, tb);
        tbs.appendChild(tb);
    });
    const gR = await fetchSheet('사용설명서');
    document.getElementById('guide').innerHTML = gR.map(r => r ? r[0]?.v||'' : '').join('<br>');
    tbs.firstChild.click();
    renderAlbums();
    showPage('main');

    /* 드래그 이벤트 바인딩 */
    const dragT = document.getElementById('dragTarget');
    dragT.addEventListener('mousedown', dStart);
    dragT.addEventListener('touchstart', dStart);
    document.addEventListener('mousemove', dMove);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('touchmove', dMove, {passive: false});
    document.addEventListener('touchend', () => isDragging = false);

    /* 가나다 버튼 */
    document.getElementById('btnGanada').onclick = () => {
        const list = document.getElementById('ganadaList');
        list.innerHTML = '';
        const map = {};
        currentSongs.forEach(s => { map[s.filterArtist] = 1; });
        Object.keys(map).sort((a,b) => a.localeCompare(b,'ko')).forEach(a => {
            const b = document.createElement('div');
            b.className = 'tab';
            b.style.textAlign = 'center';
            b.textContent = a;
            b.onclick = () => { selectAndScrollArtist(a); closeM('ganadaModal'); if(window.innerWidth <= 768) toggleSidebar(); };
            list.appendChild(b);
        });
        document.getElementById('ganadaModal').style.display = 'flex';
    };

    /* 검색 입력 */
    document.getElementById('searchInput').oninput = () => renderSongList();
})();
