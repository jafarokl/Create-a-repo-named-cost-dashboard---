"""Generate watermarked preview images for a material.

Usage: python3 tools/make_previews.py <file> <item-id> [max-pages]

Converts PowerPoint/Excel/Word to PDF with LibreOffice, renders the first pages
with pdftoppm and writes previews/<item-id>-<n>.jpg with a "PREVIEW" watermark.
Needs: libreoffice, poppler-utils (pdftoppm), Pillow.
"""
import glob, os, shutil, subprocess, sys, tempfile
from PIL import Image, ImageChops, ImageDraw, ImageFont

def font(size):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

def watermark(img):
    img = img.convert("RGBA")
    w, h = img.size
    # Draw a diagonal tiled "PREVIEW" pattern on an oversized layer, rotate it, crop back to size.
    big = Image.new("RGBA", (w * 2, h * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    f = font(max(18, w // 18))
    for y in range(0, h * 2, max(80, h // 4)):
        for x in range(0, w * 2, max(200, w // 2)):
            d.text((x + (y // 3) % 120, y), "PREVIEW", font=f, fill=(80, 80, 120, 34))
    big = big.rotate(24)
    layer = big.crop((w // 2, h // 2, w // 2 + w, h // 2 + h))
    badge = ImageDraw.Draw(layer)
    badge.rounded_rectangle([w - 150, 14, w - 14, 50], 10, fill=(14, 20, 39, 215))
    badge.text((w - 134, 21), "PREVIEW", font=font(18), fill=(255, 255, 255, 255))
    return Image.alpha_composite(img, layer).convert("RGB")

def trim(im, pad=40):
    """Crop away empty white margins (useful for spreadsheets printed on a big page)."""
    rgb = im.convert("RGB")
    bbox = ImageChops.difference(rgb, Image.new("RGB", rgb.size, (255, 255, 255))).point(lambda v: 255 if v > 12 else 0).getbbox()
    if not bbox:
        return im
    l, t, r, b = bbox
    box = (max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad))
    cropped = im.crop(box)
    # Keep at least a 4:3-ish canvas so tiny tables don't become slivers.
    w = max(cropped.width, int(cropped.height * 1.33))
    h = max(cropped.height, int(w * 0.6))
    canvas = Image.new("RGB", (w, h), (255, 255, 255))
    canvas.paste(cropped, ((w - cropped.width) // 2, (h - cropped.height) // 2))
    return canvas

def main(src, item_id, max_pages=4):
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "previews")
    os.makedirs(out_dir, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        pdf = src
        if not src.lower().endswith(".pdf"):
            subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", tmp, src], check=True, capture_output=True)
            pdf = glob.glob(os.path.join(tmp, "*.pdf"))[0]
        subprocess.run(["pdftoppm", "-r", "90", "-png", "-l", str(max_pages), pdf, os.path.join(tmp, "p")], check=True)
        pages = sorted(glob.glob(os.path.join(tmp, "p*.png")))
        for old in glob.glob(os.path.join(out_dir, f"{item_id}-*.jpg")):
            os.remove(old)
        for n, p in enumerate(pages, 1):
            im = trim(Image.open(p))
            if im.width < 900:
                im = im.resize((900, int(im.height * 900 / im.width)), Image.LANCZOS)
            if im.width > 1200:
                im = im.resize((1200, int(im.height * 1200 / im.width)))
            watermark(im).save(os.path.join(out_dir, f"{item_id}-{n}.jpg"), quality=82)
            print(f"previews/{item_id}-{n}.jpg")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 4)
