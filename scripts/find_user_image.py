import os
import glob
import shutil

# Search locations for recently created image files
import os

# Prefer the new folder name 'kishore kumar' but fall back to 'kishor kumar' if present.
home = os.path.expanduser('~')
preferred_folder = os.path.join(home, 'kishore kumar')
legacy_folder = os.path.join(home, 'kishor kumar')

search_dirs = [
    os.path.join(home, '.gemini', 'antigravity-ide', 'brain', '7f95d476-34b6-438c-a9b7-9a87a9a69a7c'),
    os.path.join(home, '.gemini', 'antigravity-ide'),
]

# Add whichever user folder exists (preferred first)
if os.path.exists(preferred_folder):
    search_dirs.append(preferred_folder)
elif os.path.exists(legacy_folder):
    search_dirs.append(legacy_folder)
else:
    # add preferred as fallback (will simply not be found if missing)
    search_dirs.append(preferred_folder)

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

# Determine destination path based on detected folder
detected_home_folder = None
if os.path.exists(preferred_folder):
    detected_home_folder = preferred_folder
elif os.path.exists(legacy_folder):
    detected_home_folder = legacy_folder
else:
    detected_home_folder = preferred_folder

dest = os.path.join(detected_home_folder, 'public', 'assets', 'hero-bg.jpg')
os.makedirs(os.path.dirname(dest), exist_ok=True)

if all_imgs:
    latest = all_imgs[0][0]
    shutil.copyfile(latest, dest)
    print(f"\nSuccessfully copied {latest} to {dest}")
