// ==========================================
// ALBUM DATA — 새 커버곡 추가 시 이 배열 맨 위에 추가
// image: albums/ 폴더 내 파일명 (없으면 "" 로 둠)
// ==========================================
const ALBUMS = [
    { title: "Whatever (Prod.Chewiser)", artist: "요코링", image: "Whatever.webp", youtubeUrl: "https://www.youtube.com/watch?v=spD5mnYrOvk"},
    { title: "All the way (Prod.YoungTaylor x AlsBeats)", artist: "요코링", image: "Alltheway.webp", youtubeUrl: "https://www.youtube.com/watch?v=0wS8p_lJSBo"},
    { title: "Curious (Prod.WhiteLIT)", artist: "요코링", image: "Curious.webp", youtubeUrl: "https://www.youtube.com/watch?v=ZyLEP631F44"},
    { title: "Blue (원곡: 볼빨간 사춘기)", artist: "요코링", image: "Blue.webp", youtubeUrl: "https://www.youtube.com/watch?v=IxVgqZ4Oo4c"},
    { title: "Fix you (원곡: Skinny Brown)", artist: "요코링", image: "fixyou.webp", youtubeUrl: "https://www.youtube.com/watch?v=5d1_LKLF2Dg"},
    { title: "Auburn (원곡: 데이먼스 이어)", artist: "요코링", image: "Auburn.webp", youtubeUrl: "https://www.youtube.com/watch?v=lAbisQ9vZq0"},
    { title: "너의 바다 (원곡: 호피폴라)", artist: "요코링", image: "너의바다.webp", youtubeUrl: "https://www.youtube.com/watch?v=t9wNfKu19V8"},
    { title: "창백한 푸른 점 (원곡: 심규선)", artist: "요코링", image: "창백한푸른점.webp", youtubeUrl: "https://www.youtube.com/watch?v=hY33cXrLdOg"},
    { title: "난설헌[蘭雪軒] (원곡: 심규선)", artist: "요코링", image: "난설헌.webp", youtubeUrl: "https://www.youtube.com/watch?v=T5Ode0fzlTQ"},
    { title: "Opening (원곡: LUCY)", artist: "요코링", image: "Opening.webp", youtubeUrl: "https://www.youtube.com/watch?v=zsJ8WOReIek"},
    { title: "경북 경산시 (원곡: 김승민)", artist: "요코링", image: "경북경산시.webp", youtubeUrl: "https://www.youtube.com/watch?v=V5HhxB7V2fo"},
    { title: "물망초 (원곡: V.et)", artist: "요코링", image: "물망초.webp", youtubeUrl: "https://www.youtube.com/watch?v=1PhnAEfLwtc"},
    { title: "푸른 산호초 (원곡: 마츠다 세이코)", artist: "요코링", image: "푸른산호초.webp", youtubeUrl: "https://www.youtube.com/watch?v=oLtSZRZQZUA"},
    { title: "소로 小路 (원곡: 심규선)", artist: "요코링", image: "소로.webp", youtubeUrl: "https://www.youtube.com/watch?v=mWuBisZ_y-"},
    { title: "요란 搖亂 (원곡: 심규선)", artist: "요코링", image: "요란.webp", youtubeUrl: "https://www.youtube.com/watch?v=0mlJNP46MOc"},
    { title: "수월경화 水月鏡花 (원곡: 김승민)", artist: "요코링", image: "수월경화.webp", youtubeUrl: "https://www.youtube.com/watch?v=U0mji7IT8Xs"},
    { title: "Part Of Her (원곡: 한요한, 김승민)", artist: "요코링", image: "PartOfHer.webp", youtubeUrl: "https://www.youtube.com/watch?v=QUMvsABnVtw"}
];

function renderAlbums() {
    const grid = document.getElementById('albumGrid');
    if (!grid) return;
    grid.innerHTML = '';
    ALBUMS.forEach(album => {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', album.title + ' — ' + album.artist);
        if (album.youtubeUrl) {
            card.addEventListener('click', () => window.open(album.youtubeUrl, '_blank', 'noopener'));
            card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') window.open(album.youtubeUrl, '_blank', 'noopener'); });
        }
        if (album.image) {
            const img = document.createElement('img');
            img.className = 'album-cover-img';
            img.src = 'albums/' + album.image;
            img.alt = album.title;
            img.addEventListener('error', () => { if (card.contains(img)) card.removeChild(img); card.insertBefore(buildAlbumPlaceholder(), card.firstChild); });
            card.appendChild(img);
        } else {
            card.appendChild(buildAlbumPlaceholder());
        }
        const overlay = document.createElement('div');
        overlay.className = 'album-overlay';
        overlay.innerHTML = '<div class="album-overlay-title">' + album.title + '</div>'
            + '<div class="album-overlay-artist">' + album.artist + '</div>'
            + '<div class="album-overlay-yt"><i class="fa-brands fa-youtube" style="font-size:14px; color:#FF4444;"></i>&nbsp;YouTube에서 보기</div>';
        card.appendChild(overlay);
        grid.appendChild(card);
    });
}

function buildAlbumPlaceholder() {
    const ph = document.createElement('div');
    ph.className = 'album-placeholder';
    const logo = document.createElement('img');
    logo.src = 'KoringSign.png';
    logo.alt = '요코링';
    ph.appendChild(logo);
    return ph;
}
