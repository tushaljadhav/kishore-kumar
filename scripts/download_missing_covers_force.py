import os
import shutil
import sys
import subprocess

missing_songs = [
    {"id": "mere-mehboob-qayamat-hogi", "query": "Mere Mehboob Qayamat Hogi Mr X in Bombay Kishore Kumar"},
    {"id": "rimjhim-gire-saawan", "query": "Rimjhim Gire Saawan Manzil Kishore Kumar"},
    {"id": "oh-hansini", "query": "Oh Hansini Zehreela Insaan Kishore Kumar"},
    {"id": "kehna-hai-kehna-hai", "query": "Kehna Hai Kehna Hai Padosan Kishore Kumar"},
    {"id": "phir-wohi-raat-hai", "query": "Phir Wohi Raat Hai Ghar Kishore Kumar"},
    {"id": "aise-na-mujhe-tum-dekho", "query": "Aise Na Mujhe Tum Dekho Darling Darling Kishore Kumar"},
    {"id": "dilbar-mere", "query": "Dilbar Mere Satte Pe Satta Kishore Kumar"},
    {"id": "dream-girl", "query": "Dream Girl Kishore Kumar"}
]

output_dir = os.path.join(os.path.dirname(__file__), "../public/assets/covers")
os.makedirs(output_dir, exist_ok=True)

print("Downloading covers for the remaining 8 Classic songs...")

for song in missing_songs:
    song_id = song["id"]
    dest = os.path.join(output_dir, f"{song_id}.jpg")
    
    print(f"Downloading cover for {song_id}...")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--skip-download",
        "--write-thumbnail",
        "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
        f"ytsearch1:{song['query']}"
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    
    files = [f for f in os.listdir(output_dir) if f.startswith(song_id)]
    if files:
        for f in files:
            src = os.path.join(output_dir, f)
            try:
                shutil.copyfile(src, dest)
            except Exception as e:
                pass
        print(f"  Saved: {dest}")
    else:
        print(f"  Failed: {song_id}")

print("Missing covers download complete.")
