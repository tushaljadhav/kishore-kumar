import os
import subprocess
import sys

songs = [
    { "id": "mere-mehboob-qayamat-hogi", "query": "ytsearch1:Mere Mehboob Qayamat Hogi Kishore Kumar original audio" },
    { "id": "o-mere-dil-ke-chain", "query": "ytsearch1:O Mere Dil Ke Chain Kishore Kumar original audio" },
    { "id": "pal-pal-dil-ke-paas", "query": "ytsearch1:Pal Pal Dil Ke Paas Kishore Kumar original audio" },
    { "id": "yeh-jo-mohabbat-hai", "query": "ytsearch1:Yeh Jo Mohabbat Hai Kishore Kumar original audio" },
    { "id": "roop-tera-mastana", "query": "ytsearch1:Roop Tera Mastana Kishore Kumar original audio" },
    { "id": "mere-sapnon-ki-rani", "query": "ytsearch1:Mere Sapnon Ki Rani Kishore Kumar original audio" },
    { "id": "hum-mein-tumse-pyar", "query": "ytsearch1:Humein Tumse Pyaar Kitna Kishore Kumar original audio" },
    { "id": "kya-yahi-pyaar-hai", "query": "ytsearch1:Kya Yahi Pyaar Hai Kishore Kumar original audio" },
    { "id": "aap-ki-aankhon-mein-kuch", "query": "ytsearch1:Aap Ki Aankhon Mein Kuch Kishore Kumar original audio" },
    { "id": "tere-bina-zindagi-se-koi", "query": "ytsearch1:Tere Bina Zindagi Se Koi Kishore Kumar original audio" },
    { "id": "aane-wala-pal-jaane-wala-hai", "query": "ytsearch1:Aane Wala Pal Jaane Wala Hai Kishore Kumar original audio" },
    { "id": "yeh-shaam-mastani", "query": "ytsearch1:Yeh Shaam Mastani Kishore Kumar original audio" },
    { "id": "chookar-mere-man-ko", "query": "ytsearch1:Chookar Mere Man Ko Kishore Kumar original audio" },
    { "id": "dil-kya-kare", "query": "ytsearch1:Dil Kya Kare Jab Kisi Se Kishore Kumar original audio" },
    { "id": "saagar-jaisi-aankhonwali", "query": "ytsearch1:Saagar Jaisi Aankhonwali Kishore Kumar original audio" },
    { "id": "phoolon-ke-rang-se", "query": "ytsearch1:Phoolon Ke Rang Se Kishore Kumar original audio" }
]

output_dir = os.path.join(os.path.dirname(__file__), "../public/audio")
os.makedirs(output_dir, exist_ok=True)

print(f"Starting batch download of {len(songs)} Kishore Kumar classics into {output_dir}...")

for idx, song in enumerate(songs, 1):
    song_id = song["id"]
    target_path = os.path.join(output_dir, f"{song_id}.m4a")
    
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000000:
        print(f"[{idx}/{len(songs)}] Skipped (Already downloaded): {song_id}.m4a")
        continue

    print(f"[{idx}/{len(songs)}] Downloading audio for {song_id}...")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "m4a/bestaudio/140",
        "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
        song["query"]
    ]
    
    try:
        res = subprocess.run(cmd, capture_output=True, text=True)
        if os.path.exists(target_path):
            print(f"  [OK] Successfully downloaded: {song_id}.m4a ({os.path.getsize(target_path)} bytes)")
        else:
            print(f"  [WARN] Output file not found for {song_id}")
    except Exception as e:
        print(f"  [ERR] Failed downloading {song_id}: {e}")

print("All downloads finished successfully!")
