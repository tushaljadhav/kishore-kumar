import os
import urllib.request
import sys
import subprocess

songs = [
    # ROMANTIC
    {"id": "pal-pal-dil-ke-paas", "query": "Pal Pal Dil Ke Paas Blackmail Kishore Kumar"},
    {"id": "o-mere-dil-ke-chain", "query": "O Mere Dil Ke Chain Mere Jeevan Saathi Kishore Kumar"},
    {"id": "yeh-shaam-mastani", "query": "Yeh Shaam Mastani Kati Patang Kishore Kumar"},
    {"id": "mere-sapnon-ki-rani", "query": "Mere Sapnon Ki Rani Aradhana Kishore Kumar"},
    {"id": "roop-tera-mastana", "query": "Roop Tera Mastana Aradhana Kishore Kumar"},
    {"id": "yeh-jo-mohabbat-hai", "query": "Yeh Jo Mohabbat Hai Kati Patang Kishore Kumar"},
    {"id": "hum-mein-tumse-pyar", "query": "Humein Tumse Pyaar Kitna Kudrat Kishore Kumar"},
    {"id": "aane-wala-pal-jaane-wala-hai", "query": "Aane Wala Pal Jaane Wala Hai Gol Maal Kishore Kumar"},
    {"id": "kya-yahi-pyaar-hai", "query": "Kya Yahi Pyaar Hai Rocky Kishore Kumar"},
    {"id": "dil-kya-kare", "query": "Dil Kya Kare Julie Kishore Kumar"},
    {"id": "chookar-mere-man-ko", "query": "Chookar Mere Man Ko Yaraana Kishore Kumar"},
    {"id": "ek-ajnabee-haseena-se", "query": "Ek Ajnabee Haseena Se Ajanabee Kishore Kumar"},
    {"id": "aap-ki-aankhon-mein-kuch", "query": "Aap Ki Aankhon Mein Kuch Ghar Kishore Kumar"},
    {"id": "tere-bina-zindagi-se-koi", "query": "Tere Bina Zindagi Se Koi Aandhi Kishore Kumar"},
    {"id": "saagar-jaisi-aankhonwali", "query": "Saagar Jaisi Aankhonwali Saagar Kishore Kumar"},
    {"id": "gulabi-aankhen", "query": "Gulabi Aankhen Jo Teri Dekhi Retro"},
    {"id": "pal-bhar-ke-liye", "query": "Pal Bhar Ke Liye Johny Mera Naam Kishore Kumar"},
    {"id": "phoolon-ke-rang-se", "query": "Phoolon Ke Rang Se Prem Pujari Kishore Kumar"},

    # EMOTIONAL
    {"id": "o-saathi-re", "query": "O Saathi Re Muqaddar Ka Sikandar Kishore Kumar"},
    {"id": "chingari-koi-bhadke", "query": "Chingari Koi Bhadke Amar Prem Kishore Kumar"},
    {"id": "meri-bheegi-bheegi-si", "query": "Meri Bheegi Bheegi Si Anamika Kishore Kumar"},
    {"id": "zindagi-ke-safar", "query": "Zindagi Ke Safar Mein Aap Ki Kasam Kishore Kumar"},
    {"id": "ruk-jaana-nahin", "query": "Ruk Jaana Nahin Imtihan Kishore Kumar"},
    {"id": "musafir-hoon-yaaro", "query": "Musafir Hoon Yaaron Parichay Kishore Kumar"},
    {"id": "kuchh-to-log-kahenge", "query": "Kuchh To Log Kahenge Amar Prem Kishore Kumar"},
    {"id": "mere-naina-sawan-bhadon", "query": "Mere Naina Sawan Bhadon Mehbooba Kishore Kumar"},
    {"id": "agar-tum-na-hote", "query": "Agar Tum Na Hote Kishore Kumar"},

    # ENERGETIC
    {"id": "khaike-paan-banaraswala", "query": "Khaike Paan Banaraswala Don Kishore Kumar"},
    {"id": "zindagi-ek-safar-hai-suhana", "query": "Zindagi Ek Safar Hai Suhana Andaz Kishore Kumar"},
    {"id": "apni-to-jaise-taise", "query": "Apni To Jaise Taise Laawaris Kishore Kumar"},
    {"id": "ek-ladki-bheegi-bhagi", "query": "Ek Ladki Bheegi Bhagi Si Chalti Ka Naam Gaadi Kishore Kumar"},
    {"id": "kehdoon-tumhen", "query": "Kehdoon Tumhen Deewaar Kishore Kumar"},
    {"id": "mere-samne-wali-khidki", "query": "Mere Samne Wali Khidki Mein Padosan Kishore Kumar"},
    {"id": "pag-ghunghroo-baandh", "query": "Pag Ghunghroo Baandh Namak Halaal Kishore Kumar"},
    {"id": "bachna-ae-haseeno", "query": "Bachna Ae Haseeno Hum Kisise Kum Naheen Kishore Kumar"},
    {"id": "om-shanti-om", "query": "Om Shanti Om Karz Kishore Kumar"},
    {"id": "jahan-teri-yeh-nazar-hai", "query": "Jahan Teri Yeh Nazar Hai Kaalia Kishore Kumar"},
    {"id": "my-name-is-anthony-gonsalves", "query": "My Name Is Anthony Gonsalves Amar Akbar Anthony Kishore Kumar"},
    {"id": "samne-ye-kaun-aaya", "query": "Samne Ye Kaun Aaya Jawani Diwani Kishore Kumar"},

    # CLASSIC
    {"id": "neele-neele-ambar-par", "query": "Neele Neele Ambar Par Kalakaar Kishore Kumar"},
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

print(f"Fetching cover images for {len(songs)} songs...")

for song in songs:
    song_id = song["id"]
    dest = os.path.join(output_dir, f"{song_id}.jpg")
    
    if os.path.exists(dest) and os.path.getsize(dest) > 5000:
        print(f"Exists: {song_id}")
        continue
        
    print(f"Fetching cover for {song_id}...")
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--skip-download",
        "--write-thumbnail",
        "--convert-thumbnails", "jpg",
        "-o", os.path.join(output_dir, f"{song_id}.%(ext)s"),
        f"ytsearch1:{song['query']}"
    ]
    subprocess.run(cmd, capture_output=True, text=True)
    
    # Check for downloaded image files
    files = [f for f in os.listdir(output_dir) if f.startswith(song_id) and (f.endswith('.jpg') or f.endswith('.png') or f.endswith('.webp'))]
    if files:
        old_file = os.path.join(output_dir, files[0])
        if old_file != dest:
            if os.path.exists(dest):
                os.remove(dest)
            os.rename(old_file, dest)
        print(f"  Saved cover: {dest}")
    else:
        print(f"  Failed for: {song_id}")

print("All cover images fetching process complete!")
