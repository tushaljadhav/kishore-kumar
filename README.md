# Kishore Kumar Digital Vinyl Radio & Music System

## 🎵 How to Add a New Song

Adding a new song to your website requires only 2 simple steps:

---

### **STEP 1: Place your MP3 audio file**
Put your legally obtained `.mp3` file inside the `public/audio/` folder.

**Folder location:**
```
public/audio/your-song-name.mp3
```

**Example:**
`public/audio/zindagi-ke-safar-mein.mp3`

---

### **STEP 2: Add song info to playlist.js**
Open `src/data/playlist.js` and add a new object to the `playlist` array.

**File location:**
`src/data/playlist.js`

**Example:**
```javascript
export const playlist = [
  // ... existing songs ...

  {
    id: "zindagi-ke-safar-mein",
    title: "Zindagi Ke Safar Mein",
    artist: "Kishore Kumar",
    movie: "Aap Ki Kasam",
    audio: "/audio/zindagi-ke-safar-mein.mp3",
    cover: "/assets/images/zindagi-ke-safar.svg" // optional cover artwork
  }
];
```

That's it! The website will automatically update and render the new song in your player and playlist drawer.

---

## ⚙️ Features Included

- **Centralized Audio Manager**: Uses a single HTML5 Audio instance for high performance.
- **Lazy Loading**: Uses `preload = "metadata"` to avoid loading every MP3 into memory at page load.
- **Favorites Persistence**: Stores favorited song IDs in `localStorage` under `kishore-favorites`.
- **Missing File Handling**: Displays a friendly `"Audio file unavailable"` notification if an MP3 is missing without crashing the site.
- **Shuffle & Repeat**: Supports Shuffle and Repeat modes (Off / Repeat One / Repeat All).
- **Responsive**: Works on desktop, tablet, and mobile.
