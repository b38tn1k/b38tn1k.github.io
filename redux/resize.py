from PIL import Image
import os

# Define the directory containing the images
image_dir = 'img'
output_dir = 'resized_images'

# Ensure the output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# List of all images
image_files = [
    "ampcamp_mouseoverasset001.png", "ampcamp_mouseoverasset022.png",
    "ampcamp_mouseoverasset002.png", "ampcamp_mouseoverasset023.png",
    "ampcamp_mouseoverasset003.png", "ampcamp_mouseoverasset024.png",
    "ampcamp_mouseoverasset004.png", "ampcamp_mouseoverasset025.png",
    "ampcamp_mouseoverasset005.png", "ampcamp_mouseoverasset026.png",
    "ampcamp_mouseoverasset006.png", "ampcamp_mouseoverasset027.png",
    "ampcamp_mouseoverasset007.png", "ampcamp_mouseoverasset028.png",
    "ampcamp_mouseoverasset008.png", "ampcamp_mouseoverasset029.png",
    "ampcamp_mouseoverasset009.png", "ampcamp_mouseoverasset030.png",
    "ampcamp_mouseoverasset010.png", "ampcamp_mouseoverasset031.png",
    "ampcamp_mouseoverasset011.png", "ampcamp_mouseoverasset032.png",
    "ampcamp_mouseoverasset012.png", "ampcamp_mouseoverasset033.png",
    "ampcamp_mouseoverasset013.png", "ampcamp_mouseoverasset034.png",
    "ampcamp_mouseoverasset014.png", "ampcamp_mouseoverasset035.png",
    "ampcamp_mouseoverasset015.png", "ampcamp_mouseoverasset036.png",
    "ampcamp_mouseoverasset016.png", "ampcamp_mouseoverasset037.png",
    "ampcamp_mouseoverasset017.png", "ampcamp_mouseoverasset038.png",
    "ampcamp_mouseoverasset018.png", "ampcamp_mouseoverasset039.png",
    "ampcamp_mouseoverasset019.png", "ampcamp_mouseoverasset040.png",
    "ampcamp_mouseoverasset020.png", "ampcamp_mouseoverasset041.png",
    "ampcamp_mouseoverasset021.png", "ampcamp_mouseoverasset042.png"
]

# Process each image
for img_file in image_files:
    try:
        # Open the image
        img_path = os.path.join(image_dir, img_file)
        img = Image.open(img_path)
        
        # Calculate new dimensions (50% of original)
        new_width = img.width // 2
        new_height = img.height // 2
        
        # Resize the image
        img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Save the resized image
        output_path = os.path.join(output_dir, img_file)
        img_resized.save(output_path)
        
        print(f"Resized and saved {img_file}")
    except Exception as e:
        print(f"Error processing {img_file}: {e}")

print("All images processed.")