import os
import subprocess
import sys

song_id = "chingari-koi-bhadke"
query = "ytsearch1:Chingari Koi Bhadke Amar Prem Kishore Kumar original song"

output_dir = os.path.join(os.path.dirname(__file__), "../public/audio")
os.makedirs(output_dir, exist_ok=True)

# Remove old mp3/wav/webm if any
for ext in ['.mp3', '.wav', '.webm', '.m4a']:
    old_file = os.path.join(output_dir, f"{song_id}{ext}")
    if os.path.exists(old_file):
        try:
            os.remove(old_file)
            print(f"Removed old file: {old_file}")
        except Exception as e:
            print(f"Could not remove {old_file}: {e}")

print(f"Downloading real full HD audio for {song_id}...")

cmd = [
    sys.executable, "-m", "yt_dlp",
    "-f", "ba/bestaudio",
    "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
    query
]
subprocess.run(cmd, capture_output=True, text=True)

found = [f for f in os.listdir(output_dir) if f.startswith(song_id)]
print(f"Downloaded real audio files: {found}")
