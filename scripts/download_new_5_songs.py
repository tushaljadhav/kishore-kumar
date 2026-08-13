import os
import subprocess
import sys

new_songs = [
    { "id": "zindagi-ek-safar-hai-suhana", "query": "ytsearch1:Zindagi Ek Safar Hai Suhana Andaz Kishore Kumar" },
    { "id": "kehdoon-tumhen", "query": "ytsearch1:Kehdoon Tumhen Deewaar Kishore Kumar" },
    { "id": "ek-ajnabee-haseena-se", "query": "ytsearch1:Ek Ajnabee Haseena Se Ajanabee Kishore Kumar" },
    { "id": "gulabi-aankhen", "query": "ytsearch1:Gulabi Aankhen Jo Teri Dekhi Retro" },
    { "id": "pal-bhar-ke-liye", "query": "ytsearch1:Pal Bhar Ke Liye Johny Mera Naam Kishore Kumar" }
]

output_dir = os.path.join(os.path.dirname(__file__), "../public/audio")
os.makedirs(output_dir, exist_ok=True)

print("Downloading 5 new tracks...")

for song in new_songs:
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

print("New 5 tracks download process complete.")
