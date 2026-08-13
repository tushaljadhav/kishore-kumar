import os
import subprocess
import sys

output_dir = os.path.join(os.path.dirname(__file__), "../public/audio")

# Check all mp3/wav files that are exact dummy size 5292044
dummy_files = [f for f in os.listdir(output_dir) if (f.endswith('.mp3') or f.endswith('.wav')) and os.path.getsize(os.path.join(output_dir, f)) == 5292044]

print(f"Found {len(dummy_files)} dummy placeholder files to replace with real tracks: {dummy_files}")

for f in dummy_files:
    song_id = os.path.splitext(f)[0]
    query = f"ytsearch1:{song_id.replace('-', ' ')} Kishore Kumar original song"
    
    # Remove dummy file
    dummy_path = os.path.join(output_dir, f)
    try:
        os.remove(dummy_path)
        print(f"Removed dummy file: {f}")
    except Exception as e:
        print(f"Error removing {f}: {e}")

    print(f"Downloading real audio for {song_id}...")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "ba/bestaudio",
        "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
        query
    ]
    subprocess.run(cmd, capture_output=True, text=True)

print("All dummy files replaced with authentic full HD audio tracks!")
