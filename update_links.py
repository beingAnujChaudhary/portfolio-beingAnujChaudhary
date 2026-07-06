import os
import glob

# Files to update from ../ to ./
pages = glob.glob('pages/*.html')

for page in pages:
    if 'terms-of-service.html' in page or 'privacy-policy.html' in page:
        continue
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('href="../privacy-policy.html"', 'href="./privacy-policy.html"')
    content = content.replace('href="../terms-of-service.html"', 'href="./terms-of-service.html"')
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(content)

# Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('href="privacy-policy.html"', 'href="pages/privacy-policy.html"')
content = content.replace('href="terms-of-service.html"', 'href="pages/terms-of-service.html"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

# Update terms and privacy assets paths
for doc in ['pages/terms-of-service.html', 'pages/privacy-policy.html']:
    with open(doc, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('href="./assets', 'href="../assets')
    content = content.replace('href="./css', 'href="../css')
    content = content.replace('src="./assets', 'src="../assets')
    content = content.replace('href="./index.html"', 'href="../index.html"')
    
    with open(doc, 'w', encoding='utf-8') as f:
        f.write(content)

print("Links updated successfully.")
