import os
from PIL import Image

# Define maximum width for web-optimized images
MAX_WIDTH = 1920

# Process all JPEG files in the current directory
for filename in os.listdir('.'):
    if filename.lower().endswith('.jpeg') and "converted" not in filename:
        with Image.open(filename) as img:
            try:
                exif = img._getexif()
                if exif:
                    orientation = exif.get(0x0112)
                    if orientation == 3:
                        img = img.rotate(180, expand=True)
                    elif orientation == 6:
                        img = img.rotate(270, expand=True)
                    elif orientation == 8:
                        img = img.rotate(90, expand=True)
            except Exception as e:
                print(f"Warning: could not apply EXIF rotation for {filename} ({e})")

            # Resize if image width is larger than MAX_WIDTH
            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / float(img.width)
                new_height = int(img.height * ratio)
                resized_img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
            else:
                resized_img = img.copy()

            # Save with '_converted' appended to filename
            base, ext = os.path.splitext(filename)
            new_filename = f"{base}_converted.jpeg"
            resized_img.save(new_filename, "JPEG", quality=85, optimize=True)