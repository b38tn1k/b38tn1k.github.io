from PIL import Image
import subprocess

# Load an image
img = Image.open('amp_camp_mouse_over_sprite_sheet.png')

# Posterize the image
posterized_img = img.convert('RGBA').convert('P', palette=Image.ADAPTIVE, colors=256)  # Reduce to 64 colors

# Save the posterized image
posterized_img_path = 'posterized_image.png'
posterized_img.save(posterized_img_path)

# Compress the posterized image using optipng
compressed_img_path = 'compressed_image.png'
subprocess.run(['optipng', '-o7', posterized_img_path, '-out', compressed_img_path])