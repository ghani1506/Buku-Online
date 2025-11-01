// Load lessons list and wire up UI
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
    li.innerHTML = \`
      <span class="lesson-title">\${item.title}</span>
      <span class="badge">PDF + Video</span>
    \`;
    li.addEventListener('click', ()=> selectLesson(item));
    listEl.appendChild(li);
  }
}

function selectLesson(item){
  if (item.pdf){
    pdfFrame.src = item.pdf;
  } else {
    pdfFrame.removeAttribute('src');
  }
  if (item.video){
    videoSrc.src = item.video;
    video.load();
  } else {
    video.removeAttribute('src');
    video.load();
  }
  // Update hash for deep-link
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
