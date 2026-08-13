import os
import subprocess
import sys

rem_songs = [
    { "id": "kuchh-to-log-kahenge", "query": "ytsearch1:Kuchh To Log Kahenge Kishore Kumar" },
    { "id": "ruk-jaana-nahin", "query": "ytsearch1:Ruk Jaana Nahin Kishore Kumar Imtihan" },
    { "id": "o-saathi-re", "query": "ytsearch1:O Saathi Re Kishore Kumar Muqaddar Ka Sikandar" },
    { "id": "om-shanti-om", "query": "ytsearch1:Om Shanti Om Kishore Kumar Karz" },
    { "id": "my-name-is-anthony-gonsalves", "query": "ytsearch1:My Name Is Anthony Gonsalves Kishore Kumar" },
    { "id": "oh-hansini", "query": "ytsearch1:Oh Hansini Kishore Kumar Zehreela Insaan" },
    { "id": "dilbar-mere", "query": "ytsearch1:Dilbar Mere Kishore Kumar Satte Pe Satta" }
]

output_dir = os.path.join(os.path.dirname(__file__), "../public/audio")
os.makedirs(output_dir, exist_ok=True)

print("Downloading final 7 remaining tracks...")

for song in rem_songs:
    song_id = song["id"]
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "ba/bestaudio",
        "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
        song["query"]
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    found = [f for f in os.listdir(output_dir) if f.startswith(song_id) and (f.endswith('.m4a') or f.endswith('.webm') or f.endswith('.mp3'))]
    print(f"Result for {song_id}: {found}")

print("Final downloads complete.")
