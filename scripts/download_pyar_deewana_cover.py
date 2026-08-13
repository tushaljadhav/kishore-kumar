import os
import shutil
import sys
import subprocess

song_id = "pyar-deewana-hota-hai"
query = "Pyar Deewana Hota Hai Kati Patang Kishore Kumar"

output_dir = os.path.join(os.path.dirname(__file__), "../public/assets/covers")
os.makedirs(output_dir, exist_ok=True)

dest = os.path.join(output_dir, f"{song_id}.jpg")

print("Fetching cover for Pyar Deewana Hota Hai...")
cmd = [
    sys.executable, "-m", "yt_dlp",
    "--skip-download",
    "--write-thumbnail",
    "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
    f"ytsearch1:{query}"
]
subprocess.run(cmd, capture_output=True, text=True)

files = [f for f in os.listdir(output_dir) if f.startswith(song_id)]
if files:
    for f in files:
        src = os.path.join(output_dir, f)
        try:
            shutil.copyfile(src, dest)
        except Exception:
            pass
    print(f"Saved: {dest}")
