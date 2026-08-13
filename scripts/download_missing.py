import os
import subprocess
import sys

missing_songs = [
    { "id": "pal-pal-dil-ke-paas", "query": "ytsearch1:Pal Pal Dil Ke Paas Blackmail Kishore Kumar" },
    { "id": "hum-mein-tumse-pyar", "query": "ytsearch1:Humein Tumse Pyar Kitna Kudrat Kishore Kumar" },
    { "id": "dil-kya-kare", "query": "ytsearch1:Dil Kya Kare Jab Kisi Se Julie Kishore Kumar" },
    { "id": "phoolon-ke-rang-se", "query": "ytsearch1:Phoolon Ke Rang Se Prem Pujari Kishore Kumar" }
]

output_dir = os.path.join(os.path.dirname(__file__), "../public/audio")
os.makedirs(output_dir, exist_ok=True)

print("Downloading remaining 4 missing tracks...")

for song in missing_songs:
    song_id = song["id"]
    target_path = os.path.join(output_dir, f"{song_id}.m4a")
    print(f"Downloading {song_id}...")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "ba/bestaudio",
        "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
        song["query"]
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    # Check if any file starting with song_id was created
    found = [f for f in os.listdir(output_dir) if f.startswith(song_id) and (f.endswith('.m4a') or f.endswith('.webm') or f.endswith('.mp3') or f.endswith('.opus'))]
    print(f"Result for {song_id}: {found}")

print("Missing tracks download process complete.")
