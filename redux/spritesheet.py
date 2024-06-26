from PIL import Image
import json
import os

# Load the bounding boxes JSON file
with open('bounding_boxes.json', 'r') as file:
    bounding_boxes = json.load(file)

# Define the directory containing the images
image_dir = 'img'

# List of all images
image_files = sorted([f for f in os.listdir(image_dir) if f.startswith('ampcamp_mouseoverasset') and f.endswith('.png')])

# Initialize list to store cropped images and their dimensions
cropped_images = []
new_bounding_boxes = {}

# Process each image based on the bounding boxes
for img_file in image_files:
    try:
        img = Image.open(os.path.join(image_dir, img_file))
        bbox = bounding_boxes[img_file]
        left = int(bbox['x'] * img.width)
        upper = int(bbox['y'] * img.height)
        right = left + int(bbox['width'] * img.width)
        lower = upper + int(bbox['height'] * img.height)
        
        cropped_img = img.crop((left, upper, right, lower))
        cropped_images.append((img_file, cropped_img))
        
        new_bounding_boxes[img_file] = {
            "x": bbox['x'],
            "y": bbox['y'],
            "width": bbox['width'],
            "height": bbox['height'],
            "source_x": 0,
            "source_y": 0,
            "source_width": right - left,
            "source_height": lower - upper
        }
    except Exception as e:
        print(f"Error processing image {img_file}: {e}")

# Packing the cropped images into a composite image
if cropped_images:
    # Define dimensions for packing
    grid_cols = 6
    max_width = 0
    total_height = 0
    current_x, current_y = 0, 0
    row_heights = []

    for index, (img_file, img) in enumerate(cropped_images):
        if index % grid_cols == 0:
            current_x = 0
            if index > 0:
                current_y += row_heights[-1]
            row_heights.append(0)
        
        row_heights[-1] = max(row_heights[-1], img.height)
        max_width = max(max_width, current_x + img.width)
        current_x += img.width

    total_height = sum(row_heights)

    # Create a new image for the sprite sheet
    sprite_sheet = Image.new('RGBA', (max_width, total_height))

    current_x, current_y = 0, 0
    row_index = 0

    for index, (img_file, img) in enumerate(cropped_images):
        if index > 0 and index % grid_cols == 0:
            current_x = 0
            current_y += row_heights[row_index]
            row_index += 1

        sprite_sheet.paste(img, (current_x, current_y))
        
        new_bounding_boxes[img_file]["source_x"] = current_x
        new_bounding_boxes[img_file]["source_y"] = current_y

        current_x += img.width

    # Save the sprite sheet
    sprite_sheet.save('sprite_sheet.png')

    # Save the updated bounding boxes JSON
    with open('new_bounding_boxes.json', 'w') as file:
        json.dump(new_bounding_boxes, file)

    print("Sprite sheet created successfully.")
else:
    print("No images were processed successfully.")