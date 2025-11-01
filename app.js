// Large-file capable app: supports absolute URLs and HLS (.m3u8)
const listEl = document.getElementById('lessonList');
const pdfFrame = document.getElementById('pdfFrame');
const video = document.getElementById('videoPlayer');
const videoSrc = document.getElementById('videoSource');
const searchEl = document.getElementById('search');

document.getElementById('year').textContent = new Date().getFullYear();

let LESSONS = [];
let FILTERED = [];

async function loadLessons(){
  const resp = await fetch('data/lessons.json', {cache:'no-store'});
  LESSONS = await resp.json();
  FILTERED = LESSONS.slice();
  renderList(FILTERED);
  if (FILTERED.length){ selectLesson(FILTERED[0]); }
}

function renderList(arr){
  listEl.innerHTML = '';
  for(const item of arr){
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="lesson-title">${item.title}</span>
      <span class="badge">${(item.video||'').endsWith('.m3u8') ? 'HLS' : 'PDF + Video'}</span>
    `;
    li.addEventListener('click', ()=> selectLesson(item));
    listEl.appendChild(li);
  }
}

function setPDF(url){
  if (!url){ pdfFrame.removeAttribute('src'); return; }
  pdfFrame.src = url;
}

function setVideo(url){
  if (!url){
    video.removeAttribute('src'); video.load(); return;
  }
  if (url.endsWith('.m3u8')){
    if (video.canPlayType('application/vnd.apple.mpegurl')){
      video.src = url;
      video.load();
    } else if (window.Hls){
      const hls = new Hls({lowLatencyMode:true});
      hls.loadSource(url);
      hls.attachMedia(video);
    } else {
      alert('HLS not supported in this browser.');
    }
  } else {
    videoSrc.src = url;
    video.load();
  }
}

function selectLesson(item){
  setPDF(item.pdf || '');
  setVideo(item.video || '');
  location.hash = encodeURIComponent(item.title);
}

function applySearch(){
  const q = (searchEl.value || '').toLowerCase().trim();
  if (!q){ FILTERED = LESSONS.slice(); renderList(FILTERED); return; }
  FILTERED = LESSONS.filter(x =>
    x.title.toLowerCase().includes(q) ||
    (x.tags || []).join(' ').toLowerCase().includes(q)
  );
  renderList(FILTERED);
}

function restoreFromHash(){
  const h = decodeURIComponent(location.hash.replace('#',''));
  if (!h) return;
  const found = LESSONS.find(x => x.title === h);
  if (found) selectLesson(found);
}

searchEl.addEventListener('input', applySearch);
window.addEventListener('hashchange', restoreFromHash);

loadLessons().then(restoreFromHash).catch(err=>{
  console.error(err);
  listEl.innerHTML = '<li class="muted">Failed to load lessons.json</li>';
});
