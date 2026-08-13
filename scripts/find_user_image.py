import os
import glob
import shutil

# Search locations for recently created image files
search_dirs = [
    r"C:\Users\Tushal\.gemini\antigravity-ide\brain\7f95d476-34b6-438c-a9b7-9a87a9a69a7c",
    r"C:\Users\Tushal\.gemini\antigravity-ide",
    r"c:\Users\Tushal\kishor kumar"
]

all_imgs = []
for d in search_dirs:
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            for f in files:
                if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')) and 'cover' not in f and 'node_modules' not in root:
                    fpath = os.path.join(root, f)
                    all_imgs.append((fpath, os.path.getmtime(fpath), os.path.getsize(fpath)))

all_imgs.sort(key=lambda x: x[1], reverse=True)

print("Recent images found:")
for img in all_imgs[:10]:
    print(f"{img[0]} | Size: {img[2]} bytes | Time: {img[1]}")

dest = r"c:\Users\Tushal\kishor kumar\public\assets\hero-bg.jpg"
os.makedirs(os.path.dirname(dest), exist_ok=True)

if all_imgs:
    latest = all_imgs[0][0]
    shutil.copyfile(latest, dest)
    print(f"\nSuccessfully copied {latest} to {dest}")
