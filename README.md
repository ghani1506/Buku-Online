# Split PDF & Video Lessons (GitHub Pages)

A simple, professional split-view site: **left pane shows the selected PDF**, **right pane plays the matching MP4 video**. Perfect for lesson materials.

## 🚀 Quick Deploy on GitHub Pages
1. Create a new GitHub repo (e.g. `lesson-split-site`).
2. Upload **all files** in this folder to the **root** of the repo.
3. Go to **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` → Folder: `/ (root)` → **Save**.
4. Open the Pages URL shown there.

## 📁 Add your content
- Put PDFs in the **`/pdfs`** folder (e.g. `pdfs/wudhu.pdf`).
- Put MP4 videos in the **`/videos`** folder (e.g. `videos/wudhu.mp4`).
- Edit **`data/lessons.json`** to list lessons:
```json
[
  {
    "title": "Wudhu — Ablution Basics",
    "pdf": "pdfs/wudhu.pdf",
    "video": "videos/wudhu.mp4",
    "tags": ["wudhu","fiqh","ablution","islam"]
  },
  {
    "title": "Fractions — Part of a Whole",
    "pdf": "pdfs/fractions.pdf",
    "video": "videos/fractions.mp4",
    "tags": ["maths","fractions"]
  }
]
```
> File paths are **relative** to the repo root. Ensure names match exactly.

## 💡 Usage
- Click a lesson title in the left list: the PDF opens in the left viewer and the matching video loads in the right player.
- Use the **search bar** to filter by title or tags.
- Deep-link: the page stores the current lesson in the URL hash so you can share links to a specific lesson.

## 🧪 Test locally
You can open `index.html` directly in a modern browser. To avoid cross-origin issues in some browsers, you can run a simple local server:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## 📱 Responsive
On small screens, the layout stacks vertically; on laptops/desktops it shows a **50/50 split**.

## ⚠️ Notes
- Some browsers may download a PDF instead of previewing it inline—this is a browser setting. Users can still open the PDF in a new tab.
- Large MP4 files may take time to buffer over GitHub Pages; consider compressing for smoother playback.
