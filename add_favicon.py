import os
import re

base_dir = r"d:\Projects\portfolio-beingAnujChaudhary"

# Define the favicon tag
favicon_tag = '<link rel="icon" type="image/png" href="/assets/images/favicon_circular.png">'

# Recursively find all HTML files
for root, _, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Check if favicon already exists
            if 'rel="icon"' not in content and 'rel="shortcut icon"' not in content:
                # Add before </head>
                if "</head>" in content:
                    content = content.replace("</head>", f"    {favicon_tag}\n</head>")
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Added favicon to {path}")
