# Split PDF & Video — Large Files (GitHub Pages Friendly)

This version supports **huge videos (>5 GB)** and large PDFs by referencing **external URLs** (S3/Cloudflare R2/B2/Drive/SharePoint/OneDrive) and using **HLS streaming** for video.

GitHub itself has strict limits (file size and site size), so keep **media off GitHub** and only host this **static site** on GitHub Pages.

## Deploy
1. Upload these files to a new GitHub repo and enable **Pages** (deploy from `main`, folder `/ (root)`).
2. Host your PDFs/MP4/HLS externally (S3, Cloudflare R2 + CDN, Backblaze B2 + CDN, etc.).
3. Edit `data/lessons.json` with your absolute URLs.

### Example `data/lessons.json`
```json
[
  {
    "title": "Wudhu — Ablution Basics (MP4)",
    "pdf": "https://YOUR-BUCKET.example.com/pdfs/wudhu.pdf",
    "video": "https://YOUR-BUCKET.example.com/videos/wudhu.mp4"
  },
  {
    "title": "Wudhu — Ablution Basics (HLS)",
    "pdf": "https://YOUR-BUCKET.example.com/pdfs/wudhu.pdf",
    "video": "https://YOUR-BUCKET.example.com/videos/wudhu/master.m3u8"
  }
]
```

## Why HLS for >5GB?
- HLS splits a big video into **many small segments** and a playlist (`.m3u8`). Browsers fetch only what’s needed.
- Works well over CDNs and supports **adaptive bitrate**.

### Create HLS from an MP4
```bash
ffmpeg -i wudhu.mp4 -codec:V h264 -codec:a aac -start_number 0 -hls_time 6 -hls_list_size 0 -f hls master.m3u8
# Upload master.m3u8 + all .ts segments. Point lessons.json to the .m3u8 URL.
```

### Bucket/CDN settings
- **CORS**: allow your GitHub Pages domain to GET the files (or `*` for testing).
- **Range requests**: ensure `Accept-Ranges: bytes` is supported (most object stores/CDNs do this).
- **MIME types**:
  - `.m3u8` → `application/vnd.apple.mpegurl` (or `application/x-mpegURL`)
  - `.ts` → `video/mp2t`
  - `.mp4` → `video/mp4`
  - `.pdf` → `application/pdf`
