from PIL import Image
import os
import argparse

def scale_pngs_to_width(src_dir, width=1000, suffix="_1000w"):
    """
    Create scaled-down copies of all .png files in src_dir so their
    width is 1000px and height is scaled proportionally.
    New files are written next to originals with a suffix.
    """

    for name in os.listdir(src_dir):
        if not name.lower().endswith(".png"):
            continue

        path = os.path.join(src_dir, name)
        img = Image.open(path)

        # Compute new size preserving aspect ratio
        w0, h0 = img.size
        new_w = width
        scale = new_w / float(w0)
        new_h = int(h0 * scale)

        # Resize
        resized = img.resize((new_w, new_h), Image.LANCZOS)

        # Build output filename
        base, ext = os.path.splitext(name)
        out_path = os.path.join(src_dir, f"{base}{suffix}{ext}")

        resized.save(out_path)
        print(f"Saved {out_path} ({new_w} x {new_h})")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("src_dir")
    parser.add_argument("--width", type=int, default=1000)
    parser.add_argument("--suffix", default="_scaled")
    args = parser.parse_args()
    scale_pngs_to_width(args.src_dir, width=args.width, suffix=args.suffix)