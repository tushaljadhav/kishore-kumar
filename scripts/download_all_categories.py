import os
import subprocess
import sys

songs = [
    # ROMANTIC
    {"id": "o-mere-dil-ke-chain", "query": "ytsearch1:O Mere Dil Ke Chain Kishore Kumar original audio"},
    {"id": "pal-pal-dil-ke-paas", "query": "ytsearch1:Pal Pal Dil Ke Paas Blackmail Kishore Kumar"},
    {"id": "yeh-jo-mohabbat-hai", "query": "ytsearch1:Yeh Jo Mohabbat Hai Kishore Kumar original audio"},
    {"id": "roop-tera-mastana", "query": "ytsearch1:Roop Tera Mastana Kishore Kumar original audio"},
    {"id": "mere-sapnon-ki-rani", "query": "ytsearch1:Mere Sapnon Ki Rani Kishore Kumar original audio"},
    {"id": "hum-mein-tumse-pyar", "query": "ytsearch1:Humein Tumse Pyar Kitna Kudrat Kishore Kumar"},
    {"id": "kya-yahi-pyaar-hai", "query": "ytsearch1:Kya Yahi Pyaar Hai Kishore Kumar original audio"},
    {"id": "aap-ki-aankhon-mein-kuch", "query": "ytsearch1:Aap Ki Aankhon Mein Kuch Kishore Kumar original audio"},
    {"id": "tere-bina-zindagi-se-koi", "query": "ytsearch1:Tere Bina Zindagi Se Koi Kishore Kumar original audio"},
    {"id": "aane-wala-pal-jaane-wala-hai", "query": "ytsearch1:Aane Wala Pal Jaane Wala Hai Kishore Kumar original audio"},
    {"id": "yeh-shaam-mastani", "query": "ytsearch1:Yeh Shaam Mastani Kishore Kumar original audio"},
    {"id": "chookar-mere-man-ko", "query": "ytsearch1:Chookar Mere Man Ko Kishore Kumar original audio"},
    {"id": "dil-kya-kare", "query": "ytsearch1:Dil Kya Kare Jab Kisi Se Julie Kishore Kumar"},
    {"id": "saagar-jaisi-aankhonwali", "query": "ytsearch1:Saagar Jaisi Aankhonwali Kishore Kumar original audio"},
    {"id": "phoolon-ke-rang-se", "query": "ytsearch1:Phoolon Ke Rang Se Prem Pujari Kishore Kumar"},

    # EMOTIONAL
    {"id": "chingari-koi-bhadke", "query": "ytsearch1:Chingari Koi Bhadke Amar Prem Kishore Kumar"},
    {"id": "zindagi-ke-safar", "query": "ytsearch1:Zindagi Ke Safar Mein Aap Ki Kasam Kishore Kumar"},
    {"id": "kuchh-to-log-kahenge", "query": "ytsearch1:Kuchh To Log Kahenge Amar Prem Kishore Kumar"},
    {"id": "mere-naina-sawan-bhadon", "query": "ytsearch1:Mere Naina Sawan Bhadon Mehbooba Kishore Kumar"},
    {"id": "musafir-hoon-yaaro", "query": "ytsearch1:Musafir Hoon Yaaron Parichay Kishore Kumar"},
    {"id": "ruk-jaana-nahin", "query": "ytsearch1:Ruk Jaana Nahin Imtihan Kishore Kumar"},
    {"id": "o-saathi-re", "query": "ytsearch1:O Saathi Re Tere Bina Bhi Kya Muqaddar Ka Sikandar Kishore Kumar"},
    {"id": "meri-bheegi-bheegi-si", "query": "ytsearch1:Meri Bheegi Bheegi Si Anamika Kishore Kumar"},
    {"id": "agar-tum-na-hote", "query": "ytsearch1:Agar Tum Na Hote Kishore Kumar"},

    # ENERGETIC
    {"id": "khaike-paan-banaraswala", "query": "ytsearch1:Khaike Paan Banaraswala Don Kishore Kumar"},
    {"id": "pag-ghunghroo-baandh", "query": "ytsearch1:Pag Ghunghroo Baandh Namak Halaal Kishore Kumar"},
    {"id": "bachna-ae-haseeno", "query": "ytsearch1:Bachna Ae Haseeno Hum Kisise Kum Naheen Kishore Kumar"},
    {"id": "om-shanti-om", "query": "ytsearch1:Om Shanti Om Karz Kishore Kumar"},
    {"id": "jahan-teri-yeh-nazar-hai", "query": "ytsearch1:Jahan Teri Yeh Nazar Hai Kaalia Kishore Kumar"},
    {"id": "apni-to-jaise-taise", "query": "ytsearch1:Apni To Jaise Taise Laawaris Kishore Kumar"},
    {"id": "my-name-is-anthony-gonsalves", "query": "ytsearch1:My Name Is Anthony Gonsalves Amar Akbar Anthony Kishore Kumar"},
    {"id": "ek-ladki-bheegi-bhagi", "query": "ytsearch1:Ek Ladki Bheegi Bhagi Si Chalti Ka Naam Gaadi Kishore Kumar"},
    {"id": "mere-samne-wali-khidki", "query": "ytsearch1:Mere Samne Wali Khidki Mein Padosan Kishore Kumar"},
    {"id": "samne-ye-kaun-aaya", "query": "ytsearch1:Samne Ye Kaun Aaya Jawani Diwani Kishore Kumar"},

    # CLASSIC
    {"id": "mere-mehboob-qayamat-hogi", "query": "ytsearch1:Mere Mehboob Qayamat Hogi Mr X in Bombay Kishore Kumar"},
    {"id": "rimjhim-gire-saawan", "query": "ytsearch1:Rimjhim Gire Saawan Manzil Kishore Kumar"},
    {"id": "oh-hansini", "query": "ytsearch1:Oh Hansini Zehreela Insaan Kishore Kumar"},
    {"id": "kehna-hai-kehna-hai", "query": "ytsearch1:Kehna Hai Kehna Hai Padosan Kishore Kumar"},
    {"id": "phir-wohi-raat-hai", "query": "ytsearch1:Phir Wohi Raat Hai Ghar Kishore Kumar"},
    {"id": "neele-neele-ambar-par", "query": "ytsearch1:Neele Neele Ambar Par Kalakaar Kishore Kumar"},
    {"id": "dream-girl", "query": "ytsearch1:Dream Girl Kishore Kumar"},
    {"id": "aise-na-mujhe-tum-dekho", "query": "ytsearch1:Aise Na Mujhe Tum Dekho Darling Darling Kishore Kumar"},
    {"id": "dilbar-mere", "query": "ytsearch1:Dilbar Mere Satte Pe Satta Kishore Kumar"}
]

output_dir = os.path.join(os.path.dirname(__file__), "../public/audio")
os.makedirs(output_dir, exist_ok=True)

print(f"Downloading all songs across categories ({len(songs)} total)...")

for idx, song in enumerate(songs, 1):
    song_id = song["id"]
    existing = [f for f in os.listdir(output_dir) if f.startswith(song_id) and (f.endswith('.m4a') or f.endswith('.webm') or f.endswith('.mp3')) and os.path.getsize(os.path.join(output_dir, f)) > 1000000]
    
    if existing:
        print(f"[{idx}/{len(songs)}] Exists: {song_id} ({existing[0]})")
        continue

    print(f"[{idx}/{len(songs)}] Downloading: {song_id}...")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "ba/bestaudio",
        "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
        song["query"]
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    found = [f for f in os.listdir(output_dir) if f.startswith(song_id) and (f.endswith('.m4a') or f.endswith('.webm') or f.endswith('.mp3'))]
    print(f"  Result: {found}")

print("Category downloads complete!")
