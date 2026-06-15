import os
from PIL import Image, ImageDraw

def make_circular(input_path, output_path):
    # Open the image
    img = Image.open(input_path).convert("RGBA")
    
    # Create a circular mask
    mask = Image.new('L', img.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)
    
    # Apply the mask to a transparent image
    result = Image.new('RGBA', img.size, (0, 0, 0, 0))
    result.paste(img, (0, 0), mask=mask)
    
    # Save the output
    result.save(output_path, "PNG")
    print(f"Saved circular image to {output_path}")

input_img = "d:/Projects/portfolio-beingAnujChaudhary/assets/images/favicon.jpg"
output_img = "d:/Projects/portfolio-beingAnujChaudhary/assets/images/favicon_circular.png"

make_circular(input_img, output_img)
