import os

base_dir = r'd:\Projects\portfolio-beingAnujChaudhary\projects\notes-flashcards'
script_path = os.path.join(base_dir, 'update_episodes.py')

with open(script_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace inline-nav alignment to be responsive (space-between and wrap)
content = content.replace(
    'justify-content: flex-end; align-items: center; width: 100%; gap: 2rem;',
    'justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 1rem; margin-top: 1rem;'
)

# Text align center the Loading text
content = content.replace(
    'margin-top: 2rem;">Loading...',
    'margin-top: 2rem; text-align: center;">Loading...'
)
content = content.replace(
    'margin-top: 2rem;">Laden...',
    'margin-top: 2rem; text-align: center;">Laden...'
)

with open(script_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated update_episodes.py!")
